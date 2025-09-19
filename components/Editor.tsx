'use client';

import { updateEntry } from '@/utils/api';
import { useState } from 'react';
import { useAutosave } from 'react-autosave';
import Spinner from './Spinner';

export default function Editor({ entry }: any) {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry?.analysis);
  const { summary, subject, mood, negative, color } = analysis;
  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'True' : 'False' },
  ];
  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const updatedData = await updateEntry(entry.id, _value);
      setAnalysis(updatedData.analysis);
      setIsLoading(false);
    },
  });

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        {isLoading && (
          <div className='w-full flex justify-center my-4'>
            <Spinner />
          </div>
        )}
        <textarea
          className="w-full h-[calc(100vh-66px)] p-8 text-xl outline-none resize-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="border-l border-black/10">
        <div className="p-8" style={{ backgroundColor: color }}>
          <h2 className="text-2xl bg-white/25 text-black">Analysis</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <ul>
            {analysisData.map((item) => (
              <li
                key={item.name}
                className="py-4 px-8 flex items-center justify-between border-b border-t border-black/10"
              >
                <div className="text-lg font-semibold w-1/3">{item.name}</div>
                <div className="text-lg">{item.value}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
