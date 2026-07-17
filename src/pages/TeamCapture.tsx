import React, { useState, useEffect } from 'react';
import { Upload, LogOut, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TeamCaptureProps {
  teamCode: string | null;
  onLogout: () => void;
}

interface Prompt {
  id: string;
  world: string;
  pillar: string;
  title: string;
  description: string;
  example: string;
}

interface UploadedItem {
  id: string;
  promptTitle: string;
  file_name: string;
  type: string;
  notes: string;
  created_at: string;
  status: string;
}

export default function TeamCapture({ teamCode, onLogout }: TeamCaptureProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [comments, setComments] = useState<{[key: string]: {author: string; text: string}[]}>({});
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    type: 'photo' as 'photo' | 'video' | 'testimonial',
    videoLength: 'short',
    notes: '',
    file: null as File | null,
  });

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    setLoading(true);
    const { data } = await supabase.from('prompts').select('*').order('created_at', { ascending: false });
    if (data) setPrompts(data as Prompt[]);
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({...formData, file: e.target.files[0]});
    }
  };

  const handleUpload = async () => {
    if (!selectedPrompt || !formData.file) return;
    const prompt = prompts.find(p => p.id === selectedPrompt);
    if (!prompt) return;

    setUploading(true);

    const path = `${Date.now()}_${formData.file.name}`;
    const { error: uploadError } = await supabase.storage.from('captures').upload(path, formData.file);

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('captures').getPublicUrl(path);

    const { data, error } = await supabase.from('captures').insert({
      prompt_id: prompt.id,
      world: prompt.world,
      pillar: prompt.pillar,
      type: formData.type,
      video_length: formData.type === 'video' ? formData.videoLength : null,
      status: 'draft',
      file_url: urlData.publicUrl,
      file_name: formData.file.name,
      notes: formData.notes,
      uploaded_by: teamCode || 'Team',
    }).select();

    setUploading(false);

    if (!error && data) {
      setUploadedItems([{
        id: data[0].id,
        promptTitle: prompt.title,
        file_name: formData.file.name,
        type: formData.type,
        notes: formData.notes,
        created_at: data[0].created_at,
        status: 'draft',
      }, ...uploadedItems]);
      setFormData({type: 'photo', videoLength: 'short', notes: '', file: null});
      setSelectedPrompt(null);
      setShowUploadForm(false);
    }
  };

  const addComment = async (captureId: string) => {
    if (!newComment.trim()) return;
    const author = teamCode || 'Team';
    const { error } = await supabase.from('comments').insert({
      capture_id: captureId,
      author,
      text: newComment,
    });
    if (!error) {
      setComments({
        ...comments,
        [captureId]: [...(comments[captureId] || []), { author, text: newComment }],
      });
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5DDD0] p-6 sticky top-0 z-20">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/assets/sms-ribbon.png" alt="" className="h-9 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-[#0F3D2C]">skin.mind.soul</h1>
              <p className="text-sm text-[#666] tracking-wide">This Week's Content Tasks</p>
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Instructions */}
        <div className="bg-[#EFE8DA] border border-[#B9D1DB] rounded-lg p-4 mb-6">
          <p className="text-[#0F3D2C] font-semibold mb-2">How This Works:</p>
          <p className="text-[#0F3D2C] text-sm">
            Pick a task below, film or photograph what it asks for, upload it, and add any notes.
            We'll review and integrate it into SMS Wellness' content strategy.
          </p>
        </div>

        {/* Weekly Tasks */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-[#0F3D2C]">Weekly Tasks</h2>
          {loading && <p className="text-[#666]">Loading tasks...</p>}
          {!loading && prompts.length === 0 && (
            <p className="text-[#999] italic">No tasks set yet — check back soon.</p>
          )}
          {prompts.map(prompt => (
            <div
              key={prompt.id}
              className={`rounded-lg p-5 border-2 transition cursor-pointer ${
                selectedPrompt === prompt.id
                  ? 'bg-[#0F3D2C] border-[#0F3D2C] text-white'
                  : 'bg-white border-[#E5DDD0] hover:border-[#0F3D2C]'
              }`}
              onClick={() => {
                if (selectedPrompt === prompt.id) {
                  setShowUploadForm(!showUploadForm);
                } else {
                  setSelectedPrompt(prompt.id);
                  setShowUploadForm(true);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      selectedPrompt === prompt.id
                        ? 'bg-white text-[#0F3D2C]'
                        : 'bg-[#0F3D2C] text-white'
                    }`}>
                      {prompt.world}
                    </span>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      selectedPrompt === prompt.id
                        ? 'bg-white text-[#5A7A87]'
                        : 'bg-[#EFE8DA] text-[#0F3D2C]'
                    }`}>
                      {prompt.pillar} Pillar
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${selectedPrompt === prompt.id ? 'text-white' : 'text-[#0F3D2C]'}`}>
                    {prompt.title}
                  </h3>
                  <p className={`text-sm mb-2 ${selectedPrompt === prompt.id ? 'text-gray-100' : 'text-[#666]'}`}>
                    {prompt.description}
                  </p>
                  {prompt.example && (
                    <p className={`text-xs ${selectedPrompt === prompt.id ? 'text-gray-200' : 'text-[#999]'}`}>
                      Example: {prompt.example}
                    </p>
                  )}
                </div>
                <div className={`ml-4 p-2 rounded ${selectedPrompt === prompt.id ? 'bg-white/20' : 'bg-[#FAF8F3]'}`}>
                  <Upload size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Form */}
        {showUploadForm && selectedPrompt && (
          <div className="bg-white rounded-lg p-6 border border-[#E5DDD0] mb-8">
            <h3 className="text-xl font-bold text-[#0F3D2C] mb-4">
              Upload for: {prompts.find(p => p.id === selectedPrompt)?.title}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#0F3D2C] font-semibold mb-2">Content Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                  <option value="testimonial">Testimonial</option>
                </select>
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="block text-[#0F3D2C] font-semibold mb-2">Video Length</label>
                  <select
                    value={formData.videoLength}
                    onChange={(e) => setFormData({...formData, videoLength: e.target.value})}
                    className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                  >
                    <option value="short">Short (15-30 sec)</option>
                    <option value="medium">Medium (30-60 sec)</option>
                    <option value="long">Long (60+ sec)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[#0F3D2C] font-semibold mb-2">Upload File</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C]"
                />
                {formData.file && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.file.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[#0F3D2C] font-semibold mb-2">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="E.g., 'Shot on Tuesday, cloudy day' or 'Client permission given'"
                  className="w-full p-3 border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#0F3D2C] h-20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={uploading || !formData.file}
                  className="flex-1 p-3 bg-[#0F3D2C] text-white rounded-lg font-semibold hover:bg-[#0a2819] disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Capture'}
                </button>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    setFormData({type: 'photo', videoLength: 'short', notes: '', file: null});
                  }}
                  className="flex-1 p-3 bg-[#E5DDD0] text-[#0F3D2C] rounded-lg font-semibold hover:bg-[#D0C4B8]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Items */}
        {uploadedItems.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[#0F3D2C] mb-4">Your Uploads This Session</h2>
            <div className="space-y-4">
              {uploadedItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-6 border border-[#E5DDD0]">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-[#0F3D2C]">{item.promptTitle}</h3>
                        <p className="text-sm text-[#666]">{item.file_name} · {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                        {item.status}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-[#666]">Notes: {item.notes}</p>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-[#E5DDD0] pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle size={16} className="text-[#0F3D2C]" />
                      <span className="text-sm font-semibold text-[#0F3D2C]">Comments</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {comments[item.id]?.map((comment, idx) => (
                        <div key={idx} className="text-sm p-2 bg-[#FAF8F3] rounded text-[#666]">
                          <span className="font-semibold text-[#0F3D2C]">{comment.author}: </span>
                          {comment.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addComment(item.id)}
                        className="flex-1 p-2 text-sm border border-[#E5DDD0] rounded focus:outline-none focus:border-[#0F3D2C]"
                      />
                      <button
                        onClick={() => addComment(item.id)}
                        className="p-2 bg-[#0F3D2C] text-white rounded hover:bg-[#0a2819]"
                      >
                        <Send size={16} />
                      </button>
                    </div>
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
