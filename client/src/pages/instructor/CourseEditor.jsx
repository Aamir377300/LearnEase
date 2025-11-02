import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

export default function CourseEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    api.get(`/courses/${id}`).then((r) => {
      setTitle(r.data.course.title || '');
      setDescription(r.data.course.description || '');
      setTags((r.data.course.tags || []).join(','));
    });
  }, [id, isNew]);

  const save = async () => {
    setError('');
    try {
      if (isNew) {
        const r = await api.post('/courses', {
          title,
          description,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean)
        });
        navigate(`/instructor/courses/${r.data.course._id}/edit`);
      } else {
        await api.put(`/courses/${id}`, {
          title,
          description,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean)
        });
      }
      alert('Saved');
    } catch (e) {
      setError(e?.response?.data?.message || 'Save failed');
    }
  };

  const publish = async () => {
    await api.post(`/courses/${id}/publish`);
    alert('Published');
  };

  const del = async () => {
    if (!confirm('Delete this course?')) return;
    await api.delete(`/courses/${id}`);
    navigate('/instructor');
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh]">
      <div className="w-full max-w-3xl px-2 sm:px-6 mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-tight">
          {isNew ? 'New Course' : 'Edit Course'}
        </h1>
        {!isNew && (
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-600 transition" onClick={publish}>
              Publish
            </button>
            <button className="px-4 py-2 bg-pink-700 text-white rounded-lg font-semibold hover:bg-pink-900 transition" onClick={del}>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Title</label>
            <input
              className="w-full px-3 py-2 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course title"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the course..."
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Tags (comma separated)</label>
            <input
              className="w-full px-3 py-2 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. react,javascript"
            />
          </div>
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-600 transition"
              onClick={save}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
