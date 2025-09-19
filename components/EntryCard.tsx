export default function EntryCard({
  entry,
}: {
  entry: {
    id: string;
    createdAt: string;
    analysis?: {
      summary: string;
      mood: string;
    };
  };
}) {
  const date = new Date(entry.createdAt).toDateString();
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow h-[20rem] w-[20rem]">
      <div className="px-4 py-5">{date}</div>
      <div className="px-4 py-5 h-[12rem] overflow-auto">{entry.analysis?.summary}</div>
      <div className="px-4 py-4">{entry.analysis?.mood}</div>
    </div>
  );
}
