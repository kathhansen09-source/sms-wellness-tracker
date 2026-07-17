import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import TeamCapture from './pages/TeamCapture';
import { supabase } from './lib/supabase';

type UserRole = 'admin' | 'owner' | 'team' | null;

function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [teamCode, setTeamCode] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = () => {
      // Check localStorage for role
      const storedRole = localStorage.getItem('userRole');
      const storedTeamCode = localStorage.getItem('teamCode');

      if (storedRole) {
        setRole(storedRole as UserRole);
      }
      if (storedTeamCode) {
        setTeamCode(storedTeamCode);
      }
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF8F3]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#0F3D2C] mb-2">SMS Wellness</h1>
          <p className="text-[#666]">Content Tracker</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!role ? (
          <Route path="*" element={<Login onLogin={(r, code) => {
            setRole(r);
            if (code) setTeamCode(code);
            localStorage.setItem('userRole', r);
            if (code) localStorage.setItem('teamCode', code);
          }} />} />
        ) : (
          <>
            {role === 'admin' && (
              <Route path="*" element={<AdminDashboard onLogout={() => {
                setRole(null);
                localStorage.removeItem('userRole');
              }} />} />
            )}
            {role === 'owner' && (
              <Route path="*" element={<OwnerDashboard onLogout={() => {
                setRole(null);
                localStorage.removeItem('userRole');
              }} />} />
            )}
            {role === 'team' && (
              <Route path="*" element={<TeamCapture teamCode={teamCode} onLogout={() => {
                setRole(null);
                localStorage.removeItem('userRole');
                localStorage.removeItem('teamCode');
              }} />} />
            )}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
