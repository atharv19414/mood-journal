import Editor from '@/components/Editor';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getEntry = async (id: string) => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });

  return entry;
};

export default async function EntryPage({ params }: any) {
  const {id} = await params;
  const entry = await getEntry(id);
  return (
    <div className="h-full w-full">
        <Editor entry={entry} />
    </div>
  );
}
