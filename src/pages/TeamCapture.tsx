import React, { useState, useEffect } from 'react';
import { Upload, LogOut, MessageCircle, Send } from 'lucide-react';

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

export default function TeamCapture({ teamCode, onLogout }: TeamCaptureProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [uploadedItems, setUploadedItems] = useState<any[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [comments, setComments] = useState<{[key: string]: string[]}>({});
  const [newComment, setNewComment] = useState('');

  const [formData, setFormData] = useState({
    type: 'photo' as 'photo' | 'video',
    videoLength: 'short',
    notes: '',
    file: null as File | null,
  });

  // Sample prompts for this week
  useEffect(() => {
    setPrompts([
      {
        id: '1',
        world: 'ATMOSPHERE',
        pillar: 'MIND',
        title: 'Golden Hour Hands',
        description: 'Film hands during facial in golden hour light, showing care & technique. Maps to MIND pillar (emotional safety).',
        example: 'Warm light on hands during a facial treatment, client peaceful in background',
      },
      {
        id: '2',
        world: 'TRANSFORMATION',
        pillar: 'SKIN',
        title: 'Before-After Story',
        description: 'Capture client before & after, ask how they FEEL about results. Maps to SKIN pillar (clinical results).',
        example: '"I can finally use products again without burning" — 6 weeks of tailored care',
      },
      {
        id: '3',
        world: 'AUTHORITY',
        pillar: 'SKIN',
        title: 'Why This Serum',
        description: 'Record Teagan explaining why we chose this serum over trendy alternatives. Maps to SKIN pillar (expertise).',
        example: 'Real ingredient list. Real results. Real reasons Teagan stands by it.',
      },
      {
        id: '4',
        world: 'PEOPLE',
        pillar: 'SOUL',
        title: 'Client Testimonial',
        description: 'Get therapist or client testimonial on video. Maps to SOUL pillar (connection & local).',
        example: 'Haven\'t felt this release in years. Teagan\'s hands, Teagan\'s care, Teagan\'s skill.',
      },
    ]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({...formData, file: e.target.files[0]});
    }
  };

  const handleUpload = () => {
    if (selectedPrompt && formData.file) {
      const prompt = prompts.find(p => p.id === selectedPrompt);
      setUploadedItems([...uploadedItems, {
        id: Date.now().toString(),
        promptId: selectedPrompt,
        prompt: prompt,
        file: formData.file.name,
        type: formData.type,
        videoLength: formData.videoLength,
        notes: formData.notes,
        date: new Date().toLocaleDateString(),
        status: 'pending',
      }]);
      setFormData({type: 'photo', videoLength: 'short', notes: '', file: null});
      setSelectedPrompt(null);
      setShowUploadForm(false);
    }
  };

  const addComment = (itemId: string) => {
    if (newComment.trim()) {
      setComments({
        ...comments,
        [itemId]: [...(comments[itemId] || []), newComment],
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
                  <p className={`text-xs ${selectedPrompt === prompt.id ? 'text-gray-200' : 'text-[#999]'}`}>
                    Example: {prompt.example}
                  </p>
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
                  className="flex-1 p-3 bg-[#0F3D2C] text-white rounded-lg font-semibold hover:bg-[#0a2819]"
                >
                  Upload Capture
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
            <h2 className="text-xl font-bold text-[#0F3D2C] mb-4">Your Uploads This Week</h2>
            <div className="space-y-4">
              {uploadedItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-6 border border-[#E5DDD0]">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-[#0F3D2C]">{item.prompt.title}</h3>
                        <p className="text-sm text-[#666]">{item.file} · {item.date}</p>
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
                          {comment}
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
