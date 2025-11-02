import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';

export default function LiveManager() {
  const { id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState('');

  const load = () => api.get(`/live/${id}`).then((r) => setSessions(r.data.sessions));
  useEffect(() => { load(); }, [id]);

  const schedule = async () => {
    if (!title || !startAt) { alert('Fill all fields'); return; }
    const res = await api.post(`/live/${id}`, { title, startAt: new Date(startAt) });
    setTitle(''); setStartAt('');
    load();
    alert(`Scheduled. Link: ${res.data.session.meetUrl}`);
  };

  const cancel = async (sessionId) => {
    await api.delete(`/live/${sessionId}`);
    load();
    alert('Cancelled');
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-cyan-400 tracking-tight">Live Sessions</h1>
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md p-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-zinc-300 mb-1 block">Title</label>
            <input className="w-full px-3 py-2 bg-zinc-900 text-white rounded-md border border-zinc-700" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-zinc-300 mb-1 block">Start At</label>
            <input className="w-full px-3 py-2 bg-zinc-900 text-white rounded-md border border-zinc-700" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
          </div>
          <div className="sm:col-span-3 flex items-end justify-end">
            <button className="px-6 py-2 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-600 transition" onClick={schedule}>Schedule</button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {sessions.map((s) => (
          <div key={s._id} className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md flex justify-between items-center p-5 hover:shadow-cyan-900 transition">
            <div>
              <div className="font-bold text-white">{s.title}</div>
              <div className="text-xs text-zinc-500">{new Date(s.startAt).toLocaleString()}</div>
              <a className="text-xs text-cyan-400 hover:underline" href={s.meetUrl} target="_blank" rel="noreferrer">Open Link</a>
            </div>
            <button className="px-4 py-2 bg-pink-700 text-white rounded-lg font-medium hover:bg-pink-900 transition" onClick={() => cancel(s._id)}>Cancel</button>
          </div>
        ))}
        {sessions.length === 0 && <div className="text-sm text-zinc-500">No scheduled sessions.</div>}
      </div>
    </div>
  );
}
