import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase.from('profiles').select('*');
      if (data) setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400">Admin Control Panel</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">Logout</button>
      </div>
      {/* Table code remains same */}
    </div>
  );
}