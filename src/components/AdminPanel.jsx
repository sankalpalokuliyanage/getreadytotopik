import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin'); // Admin වරුන් හැර අනෙක් අය පෙන්වන්න

    if (error) console.error("Error fetching students:", error);
    else setStudents(data);
  };

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">ශිෂ්‍ය ලැයිස්තුව</h2>
      <div className="bg-gray-900 rounded-xl overflow-hidden">
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
    </div>
  );
}