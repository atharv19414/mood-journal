import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { loadQARefineChain } from 'langchain/chains';
import z from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document';
import dotenv from 'dotenv';
import { getUserByClerkId } from './auth';

dotenv.config();

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
      ),
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    summary: z.string().describe('quick summary of the entire entry.'),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
      ),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
  })
);

const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the intrunctions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyse = async (content: string) => {
  const input = await getPrompt(content);
  const model = new ChatOpenAI({ temperature: 0, model: 'gpt-3.5-turbo' });
  const result = await model.invoke([new HumanMessage(input)]);

  try {
    return parser.parse(result.content as string);
  } catch (e) {
    console.log(e);
  }
};

const getVectorDbIndex = (userId: string) => {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_SECRET as string });
  const indexName = 'mood-journal';
  const index = pc.index(indexName).namespace(`mood-journal-namespace-${userId}`);
  return index;
};

export const addToVectorDb = async (entry) => {
  const user = await getUserByClerkId();
  const index = getVectorDbIndex(user.id);
  const text = `Entry is created at date: ${entry.createdAt} and content of entry is: ${entry.content}`;
  await index.upsertRecords([{ _id: entry.id, text: text }]);
  await new Promise((resolve) => setTimeout(resolve, 3000));
};

export const semanticSearchAndAnswer = async (query: string) => {
  const user = await getUserByClerkId();
  const index = getVectorDbIndex(user.id);
  const relevantDocs = await index.searchRecords({
    query: {
      topK: 7,
      inputs: { text: query },
    },
  });

  const inputDocs = relevantDocs.result.hits.map((k) => {
    return new Document({
      pageContent: (k.fields as { text: string })?.text,
    });
  });

  const model = new ChatOpenAI({ temperature: 0, model: 'gpt-3.5-turbo' });
  const chain = loadQARefineChain(model);
  const res = await chain.invoke({
    input_documents: inputDocs,
    question: query,
  });
  return res.output_text;
};
