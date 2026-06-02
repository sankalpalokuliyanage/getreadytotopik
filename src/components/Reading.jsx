import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Reading() {
  const [exercises, setExercises] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase.from('reading_questions').select('*');
      if (data) {
        const grouped = data.reduce((acc, curr) => {
          (acc[curr.exercise_name] = acc[curr.exercise_name] || []).push(curr);
          return acc;
        }, {});
        setExercises(grouped);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {Object.keys(exercises).map((exName) => (
        <div key={exName} className="mb-8 p-6 bg-gray-900 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">{exName}</h2>
          {exercises[exName].map((q, i) => (
            <div key={q.id} className="p-4 bg-gray-800 rounded mb-2">
              <p>{i + 1}. {q.question_text}</p>
              {q.image_url && <img src={q.image_url} className="max-w-xs" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}