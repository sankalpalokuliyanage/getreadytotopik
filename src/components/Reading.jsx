import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

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
      if (data) {
        const unique = [...new Set(data.map(item => item.exercise_name))];
        setExercises(unique);
      }
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

  const calculateScore = async () => {
    let count = 0;
    questions.forEach(q => { if (userAnswers[q.id] === q.correct_answer) count++; });
    setScore(count);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // ශිෂ්‍යයාගේ progress එක save කිරීම
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Current User ID:", user?.id);

    if (user) {
      const { data, error } = await supabase.from('student_progress').upsert([
        { 
          student_id: user.id, 
          exercise_name: selectedExercise, 
          score: count,
          created_at: new Date().toISOString()
        }
      ], { onConflict: 'student_id, exercise_name' });

      if (error) {
        console.error("Error saving progress:", error);
      } else {
        console.log("Success:", data);
      }
    }
  };

  if (!selectedExercise) {
    return (
      <div className="min-h-screen bg-gray-950 p-12 text-center">
        <h1 className="text-4xl font-black text-white mb-12 tracking-tight">Reading <span className="text-blue-500">Practice</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {exercises.map(ex => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              key={ex} onClick={() => loadQuestions(ex)} 
              className="p-8 bg-gray-900 border border-gray-800 rounded-3xl hover:border-blue-500 transition-all text-xl font-bold text-white shadow-xl"
            >
              {ex}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-12 text-white">
      <button onClick={() => setSelectedExercise(null)} className="mb-6 text-gray-400 hover:text-white">← Back to Exercises</button>
      
      <h1 className="text-3xl font-bold mb-8">{selectedExercise}</h1>
      
      {questions.map((q, idx) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={q.id} className="mb-8 p-8 bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl">
          <p className="text-lg font-medium mb-6">{idx + 1}. {q.question_text}</p>
          {q.image_url && <img src={q.image_url} className="mb-6 rounded-2xl max-h-64 mx-auto" alt="Question" />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['A', 'B', 'C', 'D'].map(opt => (
              <button key={opt} disabled={showResults} onClick={() => setUserAnswers({...userAnswers, [q.id]: opt})}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userAnswers[q.id] === opt ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 hover:border-gray-500'
                } ${showResults && q.correct_answer === opt ? 'border-green-500 bg-green-500/20' : ''}
                  ${showResults && userAnswers[q.id] === opt && q.correct_answer !== opt ? 'border-red-500 bg-red-500/20' : ''}`
                }>
                {opt}: {q[`option_${opt.toLowerCase()}`]}
              </button>
            ))}
          </div>
        </motion.div>
      ))}
      
      {!showResults ? (
        <button onClick={calculateScore} className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all">Submit Answers</button>
      ) : (
        <div className="p-8 bg-gray-900 rounded-3xl border-2 border-blue-500 text-center">
          <h2 className="text-3xl font-black">Your Score: {score} / {questions.length}</h2>
          <button onClick={() => setSelectedExercise(null)} className="mt-6 px-6 py-2 bg-gray-800 rounded-full">Try Another</button>
        </div>
      )}
    </div>
  );
}