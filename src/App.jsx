import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Reading from './components/Reading';

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
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
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
    setRole(data?.role);
    setLoading(false);
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (!session) return <Login />;
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={role === 'admin' ? <AdminPanel /> : <Dashboard />} />
        <Route path="/reading" element={<Reading />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;