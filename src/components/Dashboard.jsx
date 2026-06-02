import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // අලුතින් එකතු කළා

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Navigation සඳහා

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">TOPIK Dashboard</h1>
            <p className="text-gray-400">Welcome back to your learning journey</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-900/30 border border-red-800 text-red-400 rounded-lg hover:bg-red-800 transition"
          >
            Logout
          </button>
        </div>

        {/* Profile & Level Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gray-900 border border-gray-800 rounded-2xl flex items-center gap-4"
          >
            {user?.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-2 border-blue-500" 
              />
            )}
            <div>
              <h2 className="text-xl font-bold">{user?.user_metadata?.full_name || "User"}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </motion.div>

          <div className="p-6 bg-blue-900/20 border border-blue-800 rounded-2xl flex flex-col justify-center">
            <h3 className="text-gray-400 uppercase text-xs tracking-widest mb-1">Current Level</h3>
            <p className="text-3xl font-black text-blue-400">Beginner</p>
          </div>
        </div>

        {/* Start Section - මෙතැනදී Start Reading ලෙස වෙනස් කළා */}
        <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
          <button 
            onClick={() => navigate('/reading')} 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-bold hover:scale-105 transition-transform text-gray-950"
          >
            Start Reading
          </button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-gray-600 text-sm">
          Developed by <span className="text-blue-400">Sankalpa Lokuliyanage</span> | Kyungpook National University
        </p>
      </div>
    </div>
  );
}