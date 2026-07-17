import React, { useState } from 'react';
import { Lock, Users, Unlock } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'owner' | 'team', teamCode?: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<'select' | 'admin' | 'owner' | 'team'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = () => {
    if (email === 'kath@bubbacloud.com.au' && password === 'Emerald-Highlands-47') {
      onLogin('admin');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleOwnerLogin = () => {
    if (email && password.length >= 8) {
      onLogin('owner');
      setError('');
    } else {
      setError('Please enter valid credentials');
    }
  };

  const handleTeamAccess = () => {
    if (teamCode === 'ATMOSPHERE47') {
      onLogin('team', teamCode);
      setError('');
    } else {
      setError('Invalid team code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F3D2C] to-[#1a5a47] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/assets/sms-ribbon.png"
            alt=""
            className="w-40 h-auto mx-auto mb-4 brightness-0 invert"
          />
          <h1 className="text-4xl text-white mb-1 italic">skin.mind.soul</h1>
          <p className="text-[#B9D1DB] tracking-[0.3em] uppercase text-xs mb-3">Wellness &amp; Beauty</p>
          <p className="text-[#EFE8DA] tracking-widest uppercase text-sm">Content Tracker</p>
        </div>

        {mode === 'select' ? (
          <div className="space-y-4">
            <button
              onClick={() => setMode('admin')}
              className="w-full p-4 bg-white rounded-lg flex items-center gap-3 hover:bg-[#EFE8DA] transition"
            >
              <Lock size={24} className="text-[#0F3D2C]" />
              <div className="text-left">
                <p className="font-semibold text-[#0F3D2C]">Admin / Strategist</p>
                <p className="text-sm text-[#666]">View & manage strategy</p>
              </div>
            </button>

            <button
              onClick={() => setMode('owner')}
              className="w-full p-4 bg-white rounded-lg flex items-center gap-3 hover:bg-[#EFE8DA] transition"
            >
              <Users size={24} className="text-[#0F3D2C]" />
              <div className="text-left">
                <p className="font-semibold text-[#0F3D2C]">Owner / Client</p>
                <p className="text-sm text-[#666]">Review & approve content</p>
              </div>
            </button>

            <button
              onClick={() => setMode('team')}
              className="w-full p-4 bg-white rounded-lg flex items-center gap-3 hover:bg-[#EFE8DA] transition"
            >
              <Unlock size={24} className="text-[#0F3D2C]" />
              <div className="text-left">
                <p className="font-semibold text-[#0F3D2C]">Team Member</p>
                <p className="text-sm text-[#666]">Capture content this week</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            {mode === 'admin' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#0F3D2C] mb-6">Admin Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleAdminLogin}
                  className="w-full p-3 bg-[#0F3D2C] text-white rounded-lg font-semibold hover:bg-[#0a2819]"
                >
                  Login
                </button>
              </div>
            )}

            {mode === 'owner' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#0F3D2C] mb-6">Owner Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleOwnerLogin}
                  className="w-full p-3 bg-[#0F3D2C] text-white rounded-lg font-semibold hover:bg-[#0a2819]"
                >
                  Login
                </button>
              </div>
            )}

            {mode === 'team' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#0F3D2C] mb-6">Team Access</h2>
                <input
                  type="text"
                  placeholder="Enter team code"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleTeamAccess}
                  className="w-full p-3 bg-[#0F3D2C] text-white rounded-lg font-semibold hover:bg-[#0a2819]"
                >
                  Access
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setMode('select');
                setEmail('');
                setPassword('');
                setTeamCode('');
                setError('');
              }}
              className="w-full mt-6 p-2 text-[#0F3D2C] font-semibold hover:bg-[#FAF8F3] rounded"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
