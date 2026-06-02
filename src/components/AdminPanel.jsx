import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);
  const [q, setQ] = useState({ exercise_name: '', passage: '', question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: '', image_url: '' });

  useEffect(() => { fetchStudents(); fetchProgress(); }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from('profiles').select('*').neq('role', 'admin');
    if (data) setStudents(data);
  };

  const fetchProgress = async () => {
    // JOIN query මගින් ලකුණු සහ නම එකවර ලබා ගැනීම
    const { data } = await supabase.from('student_progress').select('exercise_name, score, profiles(full_name)');
    if (data) setProgress(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('reading_questions').insert([q]);
    if (error) alert("Error: " + error.message);
    else { alert("ප්‍රශ්නය සාර්ථකව ඇතුළත් විය!"); setQ({ ...q, question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: '', image_url: '' }); }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-gray-950">
      <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
        <button className={`px-4 py-2 ${activeTab === 'students' ? 'bg-blue-600' : 'bg-gray-800'}`} onClick={() => setActiveTab('students')}>ශිෂ්‍ය ලැයිස්තුව</button>
        <button className={`px-4 py-2 ${activeTab === 'progress' ? 'bg-blue-600' : 'bg-gray-800'}`} onClick={() => setActiveTab('progress')}>ශිෂ්‍ය ප්‍රගතිය</button>
        <button className={`px-4 py-2 ${activeTab === 'questions' ? 'bg-blue-600' : 'bg-gray-800'}`} onClick={() => setActiveTab('questions')}>Add Questions</button>
      </div>

      {activeTab === 'students' && (
        <div className="bg-gray-900 rounded-xl p-6">
          <table className="w-full text-left">
            <thead><tr><th className="p-2">නම</th><th className="p-2">Email</th></tr></thead>
            <tbody>{students.map(s => <tr key={s.id} className="border-b border-gray-800"><td className="p-2">{s.full_name}</td><td className="p-2">{s.email}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="bg-gray-900 rounded-xl p-6">
          <table className="w-full text-left">
            <thead><tr><th className="p-2">ශිෂ්‍යයා</th><th className="p-2">අභ්‍යාසය</th><th className="p-2">ලකුණු</th></tr></thead>
            <tbody>
              {progress.map((p, idx) => (
                <tr key={idx} className="border-b border-gray-800">
                  <td className="p-2">{p.profiles?.full_name || "Unknown"}</td>
                  <td className="p-2 text-blue-400">{p.exercise_name}</td>
                  <td className="p-2 font-bold">{p.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'questions' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-900 p-6 rounded-xl max-w-2xl">
          {/* ඔබේ කලින් තිබූ Form එක මෙතැනට දාන්න */}
        </form>
      )}
    </div>
  );
}