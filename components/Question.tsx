'use client';
import { askQuestion } from '@/utils/api';
import { useState } from 'react';
import Spinner from './Spinner';

export default function Question() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [queryAnswer, setQueryAnswer] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const answer = await askQuestion(value);
    setQueryAnswer(answer);
    setValue("");
    setLoading(false);
  };

  return (
    <div>
      <form className="flex gap-5" onSubmit={handleSubmit}>
        <input
          disabled={loading}
          onChange={onChange}
          value={value}
          type="text"
          placeholder="Ask a question"
          className="border border-black/20 text-lg rounded-lg w-[66%] py-2 px-4"
        />
        <button
          disabled={loading}        
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-lg text-lg"
        >
          Ask
        </button>
      </form>
      {loading && <div><Spinner /></div>}
      {queryAnswer && <div>{queryAnswer}</div>}
    </div>
  );
}
