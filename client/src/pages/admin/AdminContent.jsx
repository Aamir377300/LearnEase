import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminContent() {
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [messages, setMessages] = useState([]);

  const load = async () => {
    const [l, a, s, m] = await Promise.all([
      api.get('/admin/lectures'),
      api.get('/admin/assignments'),
      api.get('/admin/submissions'),
      api.get('/admin/messages'),
    ]);
    setLectures(l.data.lectures);
    setAssignments(a.data.assignments);
    setSubmissions(s.data.submissions);
    setMessages(m.data.messages);
  };
  useEffect(() => { load(); }, []);

  const del = async (type, id) => {
    const map = {
      lecture: () => api.delete(`/admin/lectures/${id}`),
      assignment: () => api.delete(`/admin/assignments/${id}`),
      submission: () => api.delete(`/admin/submissions/${id}`),
      message: () => api.delete(`/admin/messages/${id}`),
    };
    await map[type]();
    load();
  };

  return (
    <div className="space-y-10 w-full max-w-5xl mx-auto">
      <Section title="Lectures" items={lectures} render={(x) => (
        <>
          <div className="font-semibold text-white">{x.title}</div>
          <div className="text-xs text-zinc-400">{x.course?.title}</div>
        </>
      )} onDelete={(id) => del('lecture', id)} />

      <Section title="Assignments" items={assignments} render={(x) => (
        <>
          <div className="font-semibold text-white">{x.title}</div>
          <div className="text-xs text-zinc-400">{x.course?.title}</div>
        </>
      )} onDelete={(id) => del('assignment', id)} />

      <Section title="Submissions" items={submissions} render={(x) => (
        <>
          <div className="font-semibold text-white">{x.student?.name}</div>
          <a className="text-xs text-cyan-400 hover:underline" href={x.fileUrl} target="_blank" rel="noreferrer">Open</a>
        </>
      )} onDelete={(id) => del('submission', id)} />

      <Section title="Messages" items={messages} render={(x) => (
        <>
          <div className="font-semibold text-white">{x.sender?.name}</div>
          <div className="text-xs text-zinc-400">{x.course?.title}</div>
          <div className="text-sm text-zinc-200">{x.content}</div>
        </>
      )} onDelete={(id) => del('message', id)} />
    </div>
  );
}

function Section({ title, items, render, onDelete }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-cyan-400">{title}</h2>
      <div className="space-y-4">
        {items.map((it) => (
          <div key={it._id} className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md flex justify-between items-center p-5 hover:shadow-cyan-900 transition">
            <div className="space-y-1">{render(it)}</div>
            <button className="px-4 py-2 bg-pink-700 text-white rounded-md font-semibold hover:bg-pink-900 transition" onClick={() => onDelete(it._id)}>
              Delete
            </button>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-zinc-500">No items.</div>}
      </div>
    </div>
  );
}
