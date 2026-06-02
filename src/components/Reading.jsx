import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Reading() {
  const [exercises, setExercises] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({}); // ශිෂ්‍යයා තෝරන පිළිතුරු මෙහි ගබඩා වේ
  const [showResult, setShowResult] = useState({}); // පිළිතුරු පෙන්වනවාද යන්න මෙහි පාලනය වේ

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

  const handleSelect = (questionId, option) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const checkAnswer = (questionId) => {
    setShowResult(prev => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Reading Exercises</h1>
      {Object.keys(exercises).map((exName) => (
        <div key={exName} className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">{exName}</h2>
          <div className="space-y-6">
            {exercises[exName].map((q) => (
              <div key={q.id} className="p-5 bg-gray-800 rounded-lg">
                <p className="mb-3 font-semibold text-lg">{q.question_text}</p>
                {q.image_url && <img src={q.image_url} className="mb-4 max-w-sm rounded" />}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => handleSelect(q.id, opt)}
                      className={`p-3 rounded-lg border ${selectedAnswers[q.id] === opt ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      {opt}: {q[`option_${opt.toLowerCase()}`]}
                    </button>
                  ))}
                </div>

                <button onClick={() => checkAnswer(q.id)} className="text-sm text-blue-300 hover:underline">Show Answer</button>
                
                {showResult[q.id] && (
                  <div className={`mt-3 p-3 rounded ${selectedAnswers[q.id] === q.correct_answer ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    නිවැරදි පිළිතුර: {q.correct_answer}. {selectedAnswers[q.id] === q.correct_answer ? 'හරි!' : 'වැරදියි!'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}