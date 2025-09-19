'use client';

import { createNewEntry } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function NewEntryCard() {
    const router = useRouter();

    const handleOnClick = async () => {
      const data = await createNewEntry();
      router.push(`/journal/${data.id}`);
    };

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow h-[20rem] w-[20rem]"
        onClick={handleOnClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="text-3xl">New Entry</span>
      </div>
    </div>
  );
}
