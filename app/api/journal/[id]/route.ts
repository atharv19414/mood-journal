import { addToVectorDb, analyse } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const PATCH = async (request: Request, { params }) => {
  const { content } = await request.json();
  const user = await getUserByClerkId();
  const { id } = await params;
  const entry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id: id,
      },
    },
    data: {
      content,
    },
  });

  await addToVectorDb(entry);

  const analysis = await analyse(entry.content);
  const updated = await prisma.analysis.upsert({
    where: {
      entryId: entry.id,
    },
    create: {
      userId: user.id,
      entryId: entry.id,
      ...analysis,
    },
    update: {
      ...analysis,
    },
  });

  return NextResponse.json({ data: { ...entry, analysis: updated } });
};
