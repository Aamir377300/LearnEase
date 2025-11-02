import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const load = () => api.get('/admin/courses').then((r) => setCourses(r.data.courses));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this course?')) return;
    await api.delete(`/courses/${id}`);
    load();
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh]">
      <div className="w-full max-w-5xl px-2 sm:px-6 mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-tight">All Courses</h1>
      </div>
      <div className="w-full max-w-5xl space-y-6">
        {courses.map((c) => (
          <div key={c._id} className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md flex justify-between items-center p-5 hover:shadow-cyan-900 transition">
            <div>
              <div className="font-semibold text-white">{c.title}</div>
              <div className="text-xs text-zinc-500">{c.isPublished ? 'Published' : 'Draft'} • {c.instructor?.name}</div>
            </div>
            <div className="flex gap-2">
              <Link className="px-4 py-2 bg-cyan-700 text-white rounded-lg font-medium hover:bg-cyan-600 transition" to={`/instructor/courses/${c._id}/edit`}>Edit</Link>
              <button className="px-4 py-2 bg-pink-700 text-white rounded-lg font-medium hover:bg-pink-900 transition" onClick={() => remove(c._id)}>Delete</button>
            </div>
          </div>
        ))}
        {courses.length === 0 && <div className="text-sm text-zinc-500">No courses.</div>}
      </div>
    </div>
  );
}
