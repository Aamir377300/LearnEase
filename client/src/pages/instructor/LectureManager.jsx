import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { uploadToCloudinary } from '../../lib/upload';

export default function LectureManager() {
  const { id } = useParams();
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => api.get(`/lectures/${id}`).then((r) => setLectures(r.data.lectures));
  useEffect(() => { load(); }, [id]);

  const add = async () => {
    await api.post(`/lectures/${id}`, { title, videoUrl, order: 0 });
    setTitle(''); setVideoUrl('');
    load();
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, { folder: 'LearnEase/lectures', resourceType: 'video' });
      setVideoUrl(url);
      alert('Uploaded');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (lectureId) => {
    await api.delete(`/lectures/${lectureId}`);
    load();
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-cyan-400 tracking-tight">Lectures</h1>

      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-300 mb-1 block">Title</label>
            <input className="w-full px-3 py-2 bg-zinc-900 text-white rounded-md border border-zinc-700" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-zinc-300 mb-1 block">Video</label>
            <input className="w-full px-3 py-2 bg-zinc-900 text-white rounded-md border border-zinc-700 mb-2" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
            <input type="file" accept="video/*" onChange={onFile} className="w-full text-zinc-200" />
            {uploading && <div className="text-xs text-cyan-400 mt-1">Uploading...</div>}
            {videoUrl && (
              <a className="inline-block mt-2 px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-900 transition" href={videoUrl} target="_blank" rel="noreferrer">View Video</a>
            )}
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button className="px-6 py-2 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-600 transition" onClick={add}>Add Lecture</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {lectures.map((l) => (
          <div key={l._id} className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md flex justify-between items-center p-5 hover:shadow-cyan-900 transition">
            <div>
              <div className="font-semibold text-white">{l.title}</div>
              <a className="text-xs text-cyan-400 hover:underline" href={l.videoUrl} target="_blank" rel="noreferrer">View Video</a>
            </div>
            <button className="px-4 py-2 bg-pink-700 text-white rounded-md font-semibold hover:bg-pink-900 transition" onClick={() => remove(l._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
