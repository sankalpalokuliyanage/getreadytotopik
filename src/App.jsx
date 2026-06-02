import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null); // 'admin' හෝ 'student'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkRole(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkRole(session.user.id);
      else { setRole(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

 const checkRole = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error); // මොනවා හරි error එකක් තියෙනවද බලන්න
  } else {
    console.log("Database role:", data?.role); // මෙතන 'admin' කියලා console එකේ පේනවද?
    setRole(data?.role);
  }
  setLoading(false);
};

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
  if (!session) return <Login />;
  
  return role === 'admin' ? <AdminPanel /> : <Dashboard />;
}

export default App;