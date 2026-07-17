import React, { useState, useEffect } from 'react';
import { LogOut, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OwnerDashboardProps {
  onLogout: () => void;
}

interface Capture {
  id: string;
  world: string;
  pillar: string;
  type: string;
  status: string;
  created_at: string;
  notes: string;
  uploaded_by: string;
  file_url: string | null;
}

const WORLD_META = [
  { name: 'ATMOSPHERE', desc: 'Space, light, hands, calm' },
  { name: 'TRANSFORMATION', desc: 'Before-afters as stories' },
  { name: 'AUTHORITY', desc: 'Education, the why' },
  { name: 'PEOPLE', desc: 'Therapists, reviews' },
] as const;

export default function OwnerDashboard({ onLogout }: OwnerDashboardProps) {
  const [tab, setTab] = useState<'gallery' | 'progress' | 'pending'>('gallery');
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [monthlyTargets, setMonthlyTargets] = useState<Record<string, number>>({
    ATMOSPHERE: 3, TRANSFORMATION: 2, AUTHORITY: 3, PEOPLE: 2,
  });
  const [loading, setLoading] = useState(true);
  const [filterWorld, setFilterWorld] = useState<string>('ALL');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [capturesRes, targetsRes] = await Promise.all([
      supabase.from('captures').select('*').order('created_at', { ascending: false }),
      supabase.from('monthly_targets').select('*').eq('month', new Date().toISOString().slice(0, 7)),
    ]);

    if (capturesRes.data) setCaptures(capturesRes.data as Capture[]);
    if (targetsRes.data && targetsRes.data.length > 0) {
      const targets: Record<string, number> = {};
      targetsRes.data.forEach((t: any) => { targets[t.world] = t.target; });
      setMonthlyTargets(targets);
    }
    setLoading(false);
  };

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

  const handleApprove = async (id: string) => {
    setCaptures(captures.map(c => c.id === id ? {...c, status: 'approved'} : c));
    await supabase.from('captures').update({ status: 'approved' }).eq('id', id);
  };

  const handleReject = async (id: string) => {
    setCaptures(captures.map(c => c.id === id ? {...c, status: 'rejected'} : c));
    await supabase.from('captures').update({ status: 'rejected' }).eq('id', id);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5DDD0] p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/assets/sms-ribbon.png" alt="" className="h-10 w-auto" />
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
        {loading && <p className="text-[#666]">Loading...</p>}

        {!loading && tab === 'gallery' && (
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
              {filteredCaptures.filter(c => c.status === 'approved').length === 0 && (
                <p className="text-[#999] italic">No approved content yet.</p>
              )}
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
                      <p className="text-[#666] text-sm">By {capture.uploaded_by} · {new Date(capture.created_at).toLocaleDateString()}</p>
                      <p className="text-sm text-[#999] mt-1">{capture.notes}</p>
                      {capture.file_url && (
                        <a href={capture.file_url} target="_blank" rel="noreferrer" className="text-sm text-[#0F3D2C] underline">
                          View file
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'pending' && (
          <div>
            <h2 className="text-2xl font-bold text-[#0F3D2C] mb-6">Pending Review ({pendingCaptures.length})</h2>
            {pendingCaptures.length === 0 && (
              <p className="text-[#999] italic">Nothing waiting on review.</p>
            )}
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
                      <p className="text-[#666] text-sm">By {capture.uploaded_by} · {new Date(capture.created_at).toLocaleDateString()}</p>
                      <p className="text-sm text-[#999] mt-1">{capture.notes}</p>
                      {capture.file_url && (
                        <a href={capture.file_url} target="_blank" rel="noreferrer" className="text-sm text-[#0F3D2C] underline">
                          View file
                        </a>
                      )}
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

        {!loading && tab === 'progress' && (
          <div>
            <h2 className="text-2xl font-bold text-[#0F3D2C] mb-6">Monthly Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {WORLD_META.map(world => (
                <div key={world.name} className="bg-white rounded-lg p-6 border border-[#E5DDD0]">
                  <h3 className="font-bold text-[#0F3D2C] mb-2">{world.name}</h3>
                  <p className="text-3xl font-bold text-[#0F3D2C] mb-2">
                    {approvedByWorld[world.name as keyof typeof approvedByWorld]}/{monthlyTargets[world.name] ?? 0}
                  </p>
                  <div className="w-full bg-[#E5DDD0] rounded-full h-2">
                    <div
                      className="bg-[#0F3D2C] h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (approvedByWorld[world.name as keyof typeof approvedByWorld] / (monthlyTargets[world.name] || 1)) * 100)}%`
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
