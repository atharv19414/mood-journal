import { semanticSearchAndAnswer } from '@/utils/ai';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const { query } = await req.json();
  const answer = await semanticSearchAndAnswer(query);
  return NextResponse.json({ data: answer });
};
