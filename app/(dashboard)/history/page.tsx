import HistoryChart from '@/components/HistoryChart';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getData = async () => {
  const user = await getUserByClerkId();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const sum = analyses.reduce((all, current) => {
    return all + current.sentimentScore;
  }, 0);
  const avg = Math.round(sum / analyses.length);

  return { analyses, avg };
};

export default async function History() {
  const { analyses, avg } = await getData();
  console.log(analyses);
  return (
    <div className="w-full h-[calc(100%-25px)] px-6 py-8">
      <div><h1 className="text-2xl mb-4">{`Avg. Sentiment: ${avg}`}</h1> </div>
      <div className="w-full h-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
}
