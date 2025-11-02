import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data.courses));
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh]">
      {/* Page Header */}
      <div className="w-full max-w-5xl px-2 sm:px-6 mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-cyan-400 tracking-tight">Courses</h1>
          <p className="text-base text-zinc-400">Browse all published courses</p>
        </div>
        <div className="text-sm text-zinc-300 font-semibold sm:text-base">
          Hi, <span className="text-cyan-400">{user?.name || "Guest"}</span> <span className="text-zinc-400">({user?.role})</span>
        </div>
      </div>

      {/* Course Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2 sm:px-6 pb-14">
        {courses.map(c => (
          <div
            key={c._id}
            className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md
                       transition-transform duration-150 hover:-translate-y-2 hover:shadow-xl
                       flex flex-col justify-between relative overflow-hidden p-5"
          >
            {/* Accent Border Top */}
            <span className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-cyan-700 to-blue-500 rounded-t-2xl" />
            <div className="flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-zinc-50">{c.title}</h3>
              <p className="text-sm text-zinc-400 mt-2 mb-2 line-clamp-3">{c.description}</p>
            </div>
            <div className="mt-3">
              <Link
                to={`/courses/${c._id}`}
                className="inline-block w-full py-2 bg-cyan-700 text-zinc-100 font-semibold rounded-lg
                           hover:bg-cyan-500 text-center transition"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
