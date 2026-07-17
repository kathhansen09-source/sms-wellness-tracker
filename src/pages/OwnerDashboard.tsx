import React, { useState, useEffect } from 'react';
import { LogOut, Check, X } from 'lucide-react';

interface OwnerDashboardProps {
  onLogout: () => void;
}

interface Capture {
  id: string;
  world: string;
  pillar: string;
  type: string;
  status: string;
  date: string;
  notes: string;
  uploaded_by: string;
}

export default function OwnerDashboard({ onLogout }: OwnerDashboardProps) {
  const [tab, setTab] = useState<'gallery' | 'progress' | 'pending'>('gallery');
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [filterWorld, setFilterWorld] = useState<string>('ALL');

  const worlds = [
    { name: 'ATMOSPHERE', desc: 'Space, light, hands, calm' },
    { name: 'TRANSFORMATION', desc: 'Before-afters as stories' },
    { name: 'AUTHORITY', desc: 'Education, the why' },
    { name: 'PEOPLE', desc: 'Therapists, reviews' },
  ];

  const monthlyTargets = {
    ATMOSPHERE: 3,
    TRANSFORMATION: 2,
    AUTHORITY: 3,
    PEOPLE: 2,
  };

  useEffect(() => {
    setCaptures([
      {
        id: '1',
        world: 'ATMOSPHERE',
        pillar: 'MIND',
        type: 'photo',
        status: 'approved',
        date: '2024-07-15',
        notes: 'Perfect soft lighting',
        uploaded_by: 'Sarah',
      },
      {
        id: '2',
        world: 'TRANSFORMATION',
        pillar: 'SKIN',
        type: 'video',
        status: 'draft',
        date: '2024-07-16',
        notes: 'Client testimonial video',
        uploaded_by: 'Emma',
      },
      {
        id: '3',
        world: 'AUTHORITY',
        pillar: 'SKIN',
        type: 'video',
        status: 'approved',
        date: '2024-07-14',
        notes: 'Serum explanation',
        uploaded_by: 'Teagan',
      },
    ]);
  }, []);

  const filteredCaptures = filterWorld === 'ALL'
    ? captures
    : captures.filter(c => c.world === filterWorld);

  const pendingCaptures = captures.filter(c => c.status === 'draft');

  const approvedByWorld = {
    ATMOSPHERE: captures.filter(c => c.world === 'ATMOSPHERE' && c.status === 'approved').length,
    TRANSFORMATION: captures.filter(c => c.world === 'TRANSFORMATION' && c.status === 'approved').length,
    AUTHORITY: captures.filter(c => c.world === 'AUTHORITY' && c.status === 'approved').length,
    PEOPLE: captures.filter(c => c.world === 'PEOPLE' && c.status === 'approved').length,
  };

  const handleApprove = (id: string) => {
    setCaptures(captures.map(c => c.id === id ? {...c, status: 'approved'} : c));
  };

  const handleReject = (id: string) => {
    setCaptures(captures.map(c => c.id === id ? {...c, status: 'rejected'} : c));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5DDD0] p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/assets/sms-mono.svg" alt="" className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold text-[#0F3D2C]">skin.mind.soul</h1>
              <p className="text-sm text-[#666] tracking-wide">Owner Dashboard</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 p-2 hover:bg-[#FAF8F3] rounded text-[#666]"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E5DDD0] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {['gallery', 'pending', 'progress'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as typeof tab)}
              className={`py-4 font-semibold border-b-2 transition flex items-center gap-2 ${
                tab === t
                  ? 'text-[#0F3D2C] border-[#0F3D2C]'
                  : 'text-[#999] border-transparent hover:text-[#0F3D2C]'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'pending' && pendingCaptures.length > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                  {pendingCaptures.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {tab === 'gallery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0F3D2C]">Approved Content</h2>
              <select
                value={filterWorld}
                onChange={(e) => setFilterWorld(e.target.value)}
                className="p-2 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
              >
                <option value="ALL">All Worlds</option>
                <option value="ATMOSPHERE">ATMOSPHERE</option>
                <option value="TRANSFORMATION">TRANSFORMATION</option>
                <option value="AUTHORITY">AUTHORITY</option>
                <option value="PEOPLE">PEOPLE</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredCaptures.filter(c => c.status === 'approved').map(capture => (
                <div key={capture.id} className="bg-white rounded-lg p-4 border border-[#E5DDD0]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#0F3D2C] text-white text-xs font-semibold rounded">
                          {capture.world}
                        </span>
                        <span className="text-sm text-[#666]">{capture.type}</span>
                        <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">
                          Approved
                        </span>
                      </div>
                      <p className="text-[#666] text-sm">By {capture.uploaded_by} · {capture.date}</p>
                      <p className="text-sm text-[#999] mt-1">{capture.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'pending' && (
          <div>
            <h2 className="text-2xl font-bold text-[#0F3D2C] mb-6">Pending Review ({pendingCaptures.length})</h2>
            <div className="space-y-4">
              {pendingCaptures.map(capture => (
                <div key={capture.id} className="bg-white rounded-lg p-6 border border-[#E5DDD0]">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#0F3D2C] text-white text-xs font-semibold rounded">
                          {capture.world}
                        </span>
                        <span className="text-sm text-[#666]">{capture.type}</span>
                        <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          Pending
                        </span>
                      </div>
                      <p className="text-[#666] text-sm">By {capture.uploaded_by} · {capture.date}</p>
                      <p className="text-sm text-[#999] mt-1">{capture.notes}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(capture.id)}
                      className="flex items-center gap-2 flex-1 p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                    >
                      <Check size={20} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(capture.id)}
                      className="flex items-center gap-2 flex-1 p-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                    >
                      <X size={20} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'progress' && (
          <div>
            <h2 className="text-2xl font-bold text-[#0F3D2C] mb-6">Monthly Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {worlds.map(world => (
                <div key={world.name} className="bg-white rounded-lg p-6 border border-[#E5DDD0]">
                  <h3 className="font-bold text-[#0F3D2C] mb-2">{world.name}</h3>
                  <p className="text-3xl font-bold text-[#0F3D2C] mb-2">
                    {approvedByWorld[world.name as keyof typeof approvedByWorld]}/{monthlyTargets[world.name as keyof typeof monthlyTargets]}
                  </p>
                  <div className="w-full bg-[#E5DDD0] rounded-full h-2">
                    <div
                      className="bg-[#0F3D2C] h-2 rounded-full transition-all"
                      style={{
                        width: `${(approvedByWorld[world.name as keyof typeof approvedByWorld] / monthlyTargets[world.name as keyof typeof monthlyTargets]) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
