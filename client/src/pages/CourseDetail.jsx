import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [live, setLive] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data.course));
    api.get(`/lectures/${id}`).then((res) => setLectures(res.data.lectures));
    api.get(`/live/${id}`).then((res) => setLive(res.data.sessions));
    if (user?.role === 'student') {
      api.get('/enrollments/me').then((r) => {
        const enrolled = (r.data.enrollments || []).some((e) => e.course?._id === id || e.course === id);
        setIsEnrolled(enrolled);
      }).catch(() => setIsEnrolled(false));
    } else {
      setIsEnrolled(true); // instructors/admins can view
    }
  }, [id, user]);

  const enroll = async () => {
    await api.post(`/enrollments/${id}`);
    setIsEnrolled(true);
    alert('Enrolled');
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh]">
      {course && (
        <>
          <div className="w-full max-w-5xl px-2 sm:px-6 mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-cyan-400">{course.title}</h1>
              <p className="text-base text-zinc-400">By {course?.instructor?.name}</p>
            </div>
            {user?.role === 'student' && !isEnrolled && (
              <button className="px-5 py-2 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-600 transition" onClick={enroll}>
                Enroll
              </button>
            )}
          </div>

          <div className="w-full max-w-5xl grid md:grid-cols-3 gap-8 pb-12">
            {/* Main content grid */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow p-6">
                <h2 className="text-lg font-bold text-zinc-100 mb-2">Course Description</h2>
                <p className="text-zinc-200">{course.description}</p>
              </div>

              {/* Upcoming Live Lectures */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-cyan-400">Upcoming Live Lectures</h3>
                </div>
                <ul className="space-y-3">
                  {live.map((s) => (
                    <li key={s._id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{s.title}</div>
                        <div className="text-xs text-zinc-400">{new Date(s.startAt).toLocaleString()}</div>
                      </div>
                      {(isEnrolled || user?.role !== 'student') ? (
                        <a className="px-4 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-900 font-medium text-sm transition" href={s.meetUrl} target="_blank" rel="noreferrer">
                          Join
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-600">Enroll to join</span>
                      )}
                    </li>
                  ))}
                  {live.length === 0 && (
                    <li className="text-sm text-zinc-500">No upcoming live lectures.</li>
                  )}
                </ul>
              </div>

              {/* Lectures */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-cyan-400">Lectures</h3>
                </div>
                <ul className="space-y-3">
                  {lectures.map((l) => (
                    <li key={l._id} className="flex items-center justify-between">
                      <span className="text-zinc-100">{l.title}</span>
                      {l.videoUrl && (
                        (isEnrolled || user?.role !== 'student')
                          ? (
                            <a className="px-4 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-900 font-medium text-sm transition" href={l.videoUrl} target="_blank" rel="noreferrer">
                              Watch
                            </a>
                          )
                          : (<span className="text-xs text-zinc-600">Enroll to watch</span>)
                      )}
                    </li>
                  ))}
                  {lectures.length === 0 && (
                    <li className="text-sm text-zinc-500">No lectures yet.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-5">
              <div>
                {user?.role === 'student' ? (
                  <>
                    {isEnrolled ? (
                      <Link className="w-full block px-5 py-2 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-600 transition mb-2 text-center" to={`/assignments/${id}`}>
                        View Assignments
                      </Link>
                    ) : (
                      <button className="w-full block px-5 py-2 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-600 transition mb-2" onClick={enroll}>
                        Enroll to view assignments
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <Link className="w-full block px-5 py-2 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-600 transition mb-2 text-center" to={`/instructor/courses/${id}/assignments`}>
                      Manage Assignments
                    </Link>
                    <Link className="w-full block px-4 py-2 bg-zinc-900 text-cyan-400 border border-zinc-700 rounded-lg font-semibold hover:bg-cyan-950 hover:text-white transition text-center mb-2" to={`/instructor/courses/${id}/submissions`}>
                      View Submissions
                    </Link>
                  </>
                )}
                <Link className="w-full block px-4 py-2 bg-pink-700 text-white rounded-lg font-semibold hover:bg-pink-900 transition text-center mb-2" to={`/chat/${id}`}>
                  Open Chat
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
