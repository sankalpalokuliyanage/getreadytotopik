import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState({
    passage: '', question_text: '', option_a: '', option_b: '', 
    option_c: '', option_d: '', correct_answer: '', image_url: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin');

    if (error) console.error("Error fetching students:", error);
    else setStudents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('reading_questions').insert([q]);
    if (error) alert("Error: " + error.message);
    else {
      alert("ප්‍රශ්නය සාර්ථකව ඇතුළත් විය!");
      setQ({ passage: '', question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: '', image_url: '' });
    }
  };

  return (
    <div className="p-8 text-white">
      {/* ශිෂ්‍ය ලැයිස්තුව */}
      <h2 className="text-2xl font-bold mb-6">ශිෂ්‍ය ලැයිස්තුව</h2>
      <div className="bg-gray-900 rounded-xl overflow-hidden mb-10">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4">නම</th>
              <th className="p-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-gray-800">
                <td className="p-4">{student.full_name}</td>
                <td className="p-4">{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ප්‍රශ්න ඇතුළත් කිරීමේ පෝරමය */}
      <h2 className="text-2xl font-bold mb-6">Reading ප්‍රශ්නයක් එකතු කිරීම</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-900 p-6 rounded-xl max-w-2xl">
        <textarea placeholder="ඡේදය (Passage)" className="p-2 bg-gray-800 rounded" value={q.passage} onChange={(e) => setQ({...q, passage: e.target.value})} />
        <input placeholder="Image URL" className="p-2 bg-gray-800 rounded" value={q.image_url} onChange={(e) => setQ({...q, image_url: e.target.value})} />
        <input placeholder="ප්‍රශ්නය" className="p-2 bg-gray-800 rounded" value={q.question_text} onChange={(e) => setQ({...q, question_text: e.target.value})} />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Option A" className="p-2 bg-gray-800 rounded" value={q.option_a} onChange={(e) => setQ({...q, option_a: e.target.value})} />
          <input placeholder="Option B" className="p-2 bg-gray-800 rounded" value={q.option_b} onChange={(e) => setQ({...q, option_b: e.target.value})} />
          <input placeholder="Option C" className="p-2 bg-gray-800 rounded" value={q.option_c} onChange={(e) => setQ({...q, option_c: e.target.value})} />
          <input placeholder="Option D" className="p-2 bg-gray-800 rounded" value={q.option_d} onChange={(e) => setQ({...q, option_d: e.target.value})} />
        </div>
        <input placeholder="නිවැරදි පිළිතුර (A/B/C/D)" className="p-2 bg-gray-800 rounded" value={q.correct_answer} onChange={(e) => setQ({...q, correct_answer: e.target.value})} />
        <button type="submit" className="bg-blue-600 p-2 rounded hover:bg-blue-700">Submit Question</button>
      </form>
    </div>
  );
}