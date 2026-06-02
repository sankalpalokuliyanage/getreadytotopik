import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Reading() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchExercises = async () => {
      const { data } = await supabase.from('reading_questions').select('exercise_name');
      const uniqueExercises = [...new Set(data.map(item => item.exercise_name))];
      setExercises(uniqueExercises);
    };
    fetchExercises();
  }, []);

  const loadQuestions = async (name) => {
    const { data } = await supabase.from('reading_questions').select('*').eq('exercise_name', name);
    setQuestions(data);
    setSelectedExercise(name);
    setShowResults(false);
    setUserAnswers({});
  };

  const calculateScore = () => {
    let count = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correct_answer) count++;
    });
    setScore(count);
    setShowResults(true);
  };

  if (!selectedExercise) {
    return (
      <div className="p-12 text-center text-white">
        <h1 className="text-3xl mb-8">Select an Exercise</h1>
        <div className="grid gap-4 max-w-md mx-auto">
          {exercises.map(ex => (
            <button key={ex} onClick={() => loadQuestions(ex)} className="p-4 bg-blue-600 rounded-xl hover:bg-blue-700">{ex}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-white max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{selectedExercise}</h1>
      {questions.map((q, idx) => (
        <div key={q.id} className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-700">
          <p className="font-bold mb-4">{idx + 1}. {q.question_text}</p>
          <div className="grid grid-cols-2 gap-2">
            {['A', 'B', 'C', 'D'].map(opt => (
              <button 
                key={opt}
                disabled={showResults}
                onClick={() => setUserAnswers({...userAnswers, [q.id]: opt})}
                className={`p-3 rounded border ${
                  userAnswers[q.id] === opt ? 'bg-blue-500' : 'bg-gray-800'
                } ${showResults && q.correct_answer === opt ? 'bg-green-700' : ''} 
                  ${showResults && userAnswers[q.id] === opt && q.correct_answer !== opt ? 'bg-red-700' : ''}`
                }
              >
                {opt}: {q[`option_${opt.toLowerCase()}`]}
              </button>
            ))}
          </div>
        </div>
      ))}
      {!showResults ? (
        <button onClick={calculateScore} className="w-full py-4 bg-green-600 rounded-xl font-bold">Submit Answers</button>
      ) : (
        <div className="text-center p-6 bg-gray-800 rounded-xl">
          <h2 className="text-2xl font-bold">Your Score: {score} / {questions.length}</h2>
          <button onClick={() => setSelectedExercise(null)} className="mt-4 text-blue-400">Back to Exercises</button>
        </div>
      )}
    </div>
  );
}