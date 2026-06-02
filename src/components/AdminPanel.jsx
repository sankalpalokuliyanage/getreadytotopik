import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // අලුත් state එකක්: Exercise නම ස්ථිරව තබා ගැනීමට
  const [currentExercise, setCurrentExercise] = useState('');
  const [q, setQ] = useState({ passage: '', question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: '', image_url: '' });

  useEffect(() => { fetchStudents(); fetchProgress(); }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from('profiles').select('*').neq('role', 'admin');
    if (data) setStudents(data);
  };

  const fetchProgress = async () => {
    const { data } = await supabase.from('student_progress').select('student_id, exercise_name, score');
    if (data) setProgress(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // currentExercise එකත් ප්‍රශ්නයට එකතු කර insert කිරීම
    const { error } = await supabase.from('reading_questions').insert([{ ...q, exercise_name: currentExercise }]);
    if (error) alert("Error: " + error.message);
    else { 
      alert("Question added to " + currentExercise + "!"); 
      setQ({ passage: '', question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: '', image_url: '' }); 
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-gray-950">
      <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
        <button className={`px-4 py-2 ${activeTab === 'students' ? 'bg-blue-600' : 'bg-gray-800'}`} onClick={() => setActiveTab('students')}>Student List</button>
        <button className={`px-4 py-2 ${activeTab === 'questions' ? 'bg-blue-600' : 'bg-gray-800'}`} onClick={() => setActiveTab('questions')}>Add Questions</button>
      </div>

      {activeTab === 'students' ? (
        !selectedStudent ? (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl mb-4">Student List</h2>
            <table className="w-full text-left">
              <thead><tr><th className="p-2">Image</th><th className="p-2">Name</th><th className="p-2">Email</th></tr></thead>
              <tbody>{students.map(s => (
                <tr key={s.id} className="border-b border-gray-800 cursor-pointer hover:bg-gray-800" onClick={() => setSelectedStudent(s)}>
                  <td className="p-2"><img src={s.avatar_url || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full" alt="profile" /></td>
                  <td className="p-2 text-blue-400">{s.full_name}</td>
                  <td className="p-2">{s.email}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-900 p-6 rounded-xl">
            <button className="mb-4 text-blue-400" onClick={() => setSelectedStudent(null)}>← Back to List</button>
            <h2 className="text-xl mb-4">Progress: {selectedStudent.full_name}</h2>
            <table className="w-full text-left">
              <thead><tr><th>Exercise</th><th>Score</th></tr></thead>
              <tbody>{progress.filter(p => p.student_id === selectedStudent.id).map((p, i) => (
                <tr key={i}><td>{p.exercise_name}</td><td>{p.score}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )
      ) : (
        <div className="max-w-2xl">
          {/* පියවර 1: Exercise නම සැකසීම */}
          <div className="bg-gray-900 p-6 rounded-xl mb-6">
            <input placeholder="Set Exercise Name (e.g. TOPIK-01)" className="w-full p-2 bg-blue-900/20 border border-blue-500 rounded text-white" value={currentExercise} onChange={(e) => setCurrentExercise(e.target.value)} />
          </div>

          {/* පියවර 2: ප්‍රශ්න එකතු කිරීම */}
          {currentExercise && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-900 p-6 rounded-xl">
              <h3 className="font-bold text-blue-400">Adding to: {currentExercise}</h3>
              <textarea placeholder="Passage" className="p-2 bg-gray-800 rounded" value={q.passage} onChange={(e) => setQ({...q, passage: e.target.value})} />
              <input placeholder="Image URL" className="p-2 bg-gray-800 rounded" value={q.image_url} onChange={(e) => setQ({...q, image_url: e.target.value})} />
              <input required placeholder="Question" className="p-2 bg-gray-800 rounded" value={q.question_text} onChange={(e) => setQ({...q, question_text: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Option A" className="p-2 bg-gray-800 rounded" value={q.option_a} onChange={(e) => setQ({...q, option_a: e.target.value})} />
                <input required placeholder="Option B" className="p-2 bg-gray-800 rounded" value={q.option_b} onChange={(e) => setQ({...q, option_b: e.target.value})} />
                <input required placeholder="Option C" className="p-2 bg-gray-800 rounded" value={q.option_c} onChange={(e) => setQ({...q, option_c: e.target.value})} />
                <input required placeholder="Option D" className="p-2 bg-gray-800 rounded" value={q.option_d} onChange={(e) => setQ({...q, option_d: e.target.value})} />
              </div>
              <input required placeholder="Correct Answer (A/B/C/D)" className="p-2 bg-gray-800 rounded" value={q.correct_answer} onChange={(e) => setQ({...q, correct_answer: e.target.value})} />
              <button type="submit" className="bg-green-600 p-2 rounded text-white font-bold">Submit Question</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}