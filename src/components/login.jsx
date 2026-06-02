import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md text-center">
        <h1 className="text-4xl font-black text-blue-400 mb-2">TOPIK Portal</h1>
        <p className="text-gray-400 mb-8">Kyungpook National University</p>
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} className="w-full py-4 bg-white/5 border border-gray-600 rounded-xl hover:bg-white/10 transition text-white font-semibold">
          Login with Google
        </button>
      </motion.div>
      <p className="mt-8 text-gray-500 text-sm">Developed by Sankalpa Lokuliyanage</p>
    </div>
  );
}