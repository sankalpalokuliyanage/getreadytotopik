import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState({
    exercise_name: '', passage: '', question_text: '', option_a: '', 
    option_b: '', option_c: '', option_d: '', correct_answer: '', image_url: ''
  });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from('profiles').select('*').neq('role', 'admin');
    if (data) setStudents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('reading_questions').insert([q]);
    if (error) alert("Error: " + error.message);
    else { 
      alert("ප්‍රශ්නය සාර්ථකව ඇතුළත් විය!"); 
      // exercise_name සහ passage ඉතිරි කර අනෙක්වා පමණක් හිස් කරන්න
      setQ({ ...q, question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: '', image_url: '' }); 
    }
  };

  return (
    <div className="p-8 text-white min-h-screen">
      <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
        <button className={`px-4 py-2 ${activeTab === 'students' ? 'bg-blue-600' : 'bg-gray-800'}`} onClick={() => setActiveTab('students')}>ශිෂ්‍ය ලැයිස්තුව</button>
        <button className={`px-4 py-2 ${activeTab === 'questions' ? 'bg-blue-600' : 'bg-gray-800'}`} onClick={() => setActiveTab('questions')}>Add Reading Questions</button>
      </div>

      {activeTab === 'students' ? (
        <div className="bg-gray-900 rounded-xl overflow-hidden p-6">
          <h2 className="text-xl mb-4">ශිෂ්‍ය ලැයිස්තුව</h2>
          <table className="w-full text-left">
            <thead><tr><th className="p-2">නම</th><th className="p-2">Email</th></tr></thead>
            <tbody>{students.map(s => <tr key={s.id} className="border-b border-gray-800"><td className="p-2">{s.full_name}</td><td className="p-2">{s.email}</td></tr>)}</tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-900 p-6 rounded-xl max-w-2xl">
          <input required placeholder="Exercise Name (උදා: TOPIK-Reading-01)" className="p-2 bg-blue-900/20 border border-blue-500 rounded" value={q.exercise_name} onChange={(e) => setQ({...q, exercise_name: e.target.value})} />
          <textarea placeholder="ඡේදය (Passage)" className="p-2 bg-gray-800 rounded" value={q.passage} onChange={(e) => setQ({...q, passage: e.target.value})} />
          <input placeholder="Image URL" className="p-2 bg-gray-800 rounded" value={q.image_url} onChange={(e) => setQ({...q, image_url: e.target.value})} />
          <input required placeholder="ප්‍රශ්නය" className="p-2 bg-gray-800 rounded" value={q.question_text} onChange={(e) => setQ({...q, question_text: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input required placeholder="Option A" className="p-2 bg-gray-800 rounded" value={q.option_a} onChange={(e) => setQ({...q, option_a: e.target.value})} />
            <input required placeholder="Option B" className="p-2 bg-gray-800 rounded" value={q.option_b} onChange={(e) => setQ({...q, option_b: e.target.value})} />
            <input required placeholder="Option C" className="p-2 bg-gray-800 rounded" value={q.option_c} onChange={(e) => setQ({...q, option_c: e.target.value})} />
            <input required placeholder="Option D" className="p-2 bg-gray-800 rounded" value={q.option_d} onChange={(e) => setQ({...q, option_d: e.target.value})} />
          </div>
          <input required placeholder="නිවැරදි පිළිතුර (A/B/C/D)" className="p-2 bg-gray-800 rounded" value={q.correct_answer} onChange={(e) => setQ({...q, correct_answer: e.target.value})} />
          <button type="submit" className="bg-green-600 p-2 rounded hover:bg-green-700">Submit Question</button>
        </form>
      )}
    </div>
  );
}