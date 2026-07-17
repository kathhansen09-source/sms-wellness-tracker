import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Filter, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Prompt {
  id: string;
  world: 'ATMOSPHERE' | 'TRANSFORMATION' | 'AUTHORITY' | 'PEOPLE';
  pillar: 'SKIN' | 'MIND' | 'SOUL';
  title: string;
  description: string;
  example: string;
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
  { name: 'ATMOSPHERE', desc: 'Space, light, hands, calm. Sensory & slow.', pillar: 'MIND' },
  { name: 'TRANSFORMATION', desc: 'Before-afters as stories with feeling.', pillar: 'SKIN' },
  { name: 'AUTHORITY', desc: 'Education, the why, expert positioning.', pillar: 'SKIN' },
  { name: 'PEOPLE', desc: 'Therapists, reviews, human layer.', pillar: 'SOUL' },
] as const;

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<'prompts' | 'gallery' | 'progress'>('prompts');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [monthlyTargets, setMonthlyTargets] = useState<Record<string, number>>({
    ATMOSPHERE: 3, TRANSFORMATION: 2, AUTHORITY: 3, PEOPLE: 2,
  });
  const [loading, setLoading] = useState(true);
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [filterWorld, setFilterWorld] = useState<string>('ALL');

  const [newPrompt, setNewPrompt] = useState({
    world: 'ATMOSPHERE' as Prompt['world'],
    pillar: 'MIND' as Prompt['pillar'],
    title: '',
    description: '',
    example: '',
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [promptsRes, capturesRes, targetsRes] = await Promise.all([
      supabase.from('prompts').select('*').order('created_at', { ascending: false }),
      supabase.from('captures').select('*').order('created_at', { ascending: false }),
      supabase.from('monthly_targets').select('*').eq('month', new Date().toISOString().slice(0, 7)),
    ]);

    if (promptsRes.data) setPrompts(promptsRes.data as Prompt[]);
    if (capturesRes.data) setCaptures(capturesRes.data as Capture[]);
    if (targetsRes.data && targetsRes.data.length > 0) {
      const targets: Record<string, number> = {};
      targetsRes.data.forEach((t: any) => { targets[t.world] = t.target; });
      setMonthlyTargets(targets);
    }
    setLoading(false);
  };

  const addPrompt = async () => {
    if (!newPrompt.title || !newPrompt.description) return;
    const { data, error } = await supabase.from('prompts').insert({
      world: newPrompt.world,
      pillar: newPrompt.pillar,
      title: newPrompt.title,
      description: newPrompt.description,
      example: newPrompt.example,
    }).select();

    if (!error && data) {
      setPrompts([data[0] as Prompt, ...prompts]);
      setNewPrompt({ world: 'ATMOSPHERE', pillar: 'MIND', title: '', description: '', example: '' });
      setShowPromptForm(false);
    }
  };

  const filteredCaptures = filterWorld === 'ALL' ? captures : captures.filter(c => c.world === filterWorld);

  const capturesByWorld = {
    ATMOSPHERE: captures.filter(c => c.world === 'ATMOSPHERE').length,
    TRANSFORMATION: captures.filter(c => c.world === 'TRANSFORMATION').length,
    AUTHORITY: captures.filter(c => c.world === 'AUTHORITY').length,
    PEOPLE: captures.filter(c => c.world === 'PEOPLE').length,
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
              <p className="text-sm text-[#666] tracking-wide">Admin · Strategy Dashboard</p>
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
          {['prompts', 'gallery', 'progress'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as typeof tab)}
              className={`py-4 font-semibold border-b-2 transition ${
                tab === t
                  ? 'text-[#0F3D2C] border-[#0F3D2C]'
                  : 'text-[#999] border-transparent hover:text-[#0F3D2C]'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading && <p className="text-[#666]">Loading...</p>}

        {!loading && tab === 'prompts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0F3D2C]">Weekly Task Prompts</h2>
              <button
                onClick={() => setShowPromptForm(!showPromptForm)}
                className="flex items-center gap-2 p-3 bg-[#0F3D2C] text-white rounded-lg hover:bg-[#0a2819]"
              >
                <Plus size={20} />
                Add Prompt
              </button>
            </div>

            {showPromptForm && (
              <div className="bg-white rounded-lg p-6 mb-6 border border-[#E5DDD0]">
                <h3 className="font-semibold text-[#0F3D2C] mb-4">New Prompt</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={newPrompt.world}
                      onChange={(e) => setNewPrompt({...newPrompt, world: e.target.value as Prompt['world']})}
                      className="p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                    >
                      {WORLD_META.map(w => (
                        <option key={w.name} value={w.name}>{w.name}</option>
                      ))}
                    </select>
                    <select
                      value={newPrompt.pillar}
                      onChange={(e) => setNewPrompt({...newPrompt, pillar: e.target.value as Prompt['pillar']})}
                      className="p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                    >
                      <option value="SKIN">SKIN</option>
                      <option value="MIND">MIND</option>
                      <option value="SOUL">SOUL</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newPrompt.title}
                    onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
                    className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                  />
                  <textarea
                    placeholder="Task description (what to film & why)"
                    value={newPrompt.description}
                    onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
                    className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C] h-24"
                  />
                  <textarea
                    placeholder="Example or reference (e.g., 'Use this Google review as template')"
                    value={newPrompt.example}
                    onChange={(e) => setNewPrompt({...newPrompt, example: e.target.value})}
                    className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C] h-20"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={addPrompt}
                      className="flex-1 p-3 bg-[#0F3D2C] text-white rounded-lg font-semibold hover:bg-[#0a2819]"
                    >
                      Save Prompt
                    </button>
                    <button
                      onClick={() => setShowPromptForm(false)}
                      className="flex-1 p-3 bg-[#E5DDD0] text-[#0F3D2C] rounded-lg font-semibold hover:bg-[#D0C4B8]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {prompts.length === 0 && (
                <p className="text-[#999] italic">No prompts yet. Add the first weekly task above.</p>
              )}
              {prompts.map(prompt => (
                <div key={prompt.id} className="bg-white rounded-lg p-6 border border-[#E5DDD0] hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-[#0F3D2C] text-white text-sm font-semibold rounded">
                          {prompt.world}
                        </span>
                        <span className="px-3 py-1 bg-[#EFE8DA] text-[#0F3D2C] text-sm font-semibold rounded">
                          {prompt.pillar}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0F3D2C]">{prompt.title}</h3>
                    </div>
                  </div>
                  <p className="text-[#666] mb-2">{prompt.description}</p>
                  {prompt.example && <p className="text-sm text-[#999] italic">Example: {prompt.example}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'gallery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0F3D2C]">Content Gallery</h2>
              <div className="flex items-center gap-3">
                <Filter size={20} className="text-[#666]" />
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
            </div>

            <div className="space-y-3">
              {filteredCaptures.length === 0 && (
                <p className="text-[#999] italic">No captures yet.</p>
              )}
              {filteredCaptures.map(capture => (
                <div key={capture.id} className="bg-white rounded-lg p-4 border border-[#E5DDD0] hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#0F3D2C] text-white text-xs font-semibold rounded">
                          {capture.world}
                        </span>
                        <span className="text-sm text-[#666]">{capture.type}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          capture.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {capture.status}
                        </span>
                      </div>
                      <p className="text-[#666] text-sm">Uploaded by {capture.uploaded_by} on {new Date(capture.created_at).toLocaleDateString()}</p>
                      <p className="text-sm text-[#999] mt-1">{capture.notes}</p>
                    </div>
                    {capture.file_url && (
                      <a href={capture.file_url} target="_blank" rel="noreferrer" className="ml-4 p-2 hover:bg-[#FAF8F3] rounded">
                        <Eye size={20} className="text-[#0F3D2C]" />
                      </a>
                    )}
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
                    {capturesByWorld[world.name as keyof typeof capturesByWorld]}/{monthlyTargets[world.name] ?? 0}
                  </p>
                  <div className="w-full bg-[#E5DDD0] rounded-full h-2">
                    <div
                      className="bg-[#0F3D2C] h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (capturesByWorld[world.name as keyof typeof capturesByWorld] / (monthlyTargets[world.name] || 1)) * 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#999] mt-2">{world.pillar} pillar</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
