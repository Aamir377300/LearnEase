import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-zinc-900 to-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur shadow-lg">
        <nav className="container mx-auto flex items-center h-16 px-4">
          {/* Brand/Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-white hover:text-cyan-400 transition-colors"
          >
            <img
              src="/logo.png"
              alt="LearnEase"
              className="h-8 w-8 rounded-full border border-cyan-900 shadow-sm"
              style={{ objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            LearnEase
          </Link>
          <div className="flex-1" />
          {/* Nav Links */}
          {user ? (
            <div className="flex items-center gap-6 text-sm">
              <Link
                className="px-3 py-1 rounded hover:bg-zinc-800 text-gray-200 hover:text-cyan-300 transition"
                to="/"
              >
                Courses
              </Link>
              {user.role === 'student' && (
                <Link
                  className="px-3 py-1 rounded hover:bg-zinc-800 text-gray-200 hover:text-cyan-300 transition"
                  to="/me/enrollments"
                >
                  Enrollments
                </Link>
              )}
              {(user.role === 'instructor' || user.role === 'admin') && (
                <Link
                  className="px-3 py-1 rounded hover:bg-cyan-900 text-cyan-400 hover:text-white transition"
                  to="/instructor"
                >
                  Instructor
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  className="px-3 py-1 rounded hover:bg-red-900 text-red-400 hover:text-white transition"
                  to="/admin"
                >
                  Admin
                </Link>
              )}
              <span className="text-gray-600 select-none font-normal mx-2">|</span>
              <button
                className="px-3 py-1 rounded font-semibold text-pink-400 hover:bg-pink-950 hover:text-white transition"
                onClick={logout}
                title="Logout"
              >
                Logout
              </button>
              {/* Avatar/Initials */}
              <div className="ml-2 flex items-center gap-2">
                {user.avatar ? (
                  <img src={user.avatar} alt="profile" className="h-7 w-7 rounded-full border border-zinc-700" />
                ) : (
                  <div className="h-7 w-7 bg-cyan-800 rounded-full flex items-center justify-center font-bold text-cyan-200">
                    {user.name ? user.name.charAt(0) : "A"}
                  </div>
                )}
                <span className="text-gray-300 font-semibold">{user.name || "User"}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <Link
                className="px-3 py-1 rounded font-medium text-cyan-400 hover:bg-cyan-900 hover:text-white transition"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="px-3 py-1 rounded font-medium text-pink-400 hover:bg-pink-950 hover:text-white transition"
                to="/register"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8 min-h-[80vh]">
        <div className="rounded-xl bg-zinc-900/80 shadow-lg p-6">
          <Outlet />
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-zinc-500 tracking-wider">
        © {new Date().getFullYear()} LearnEase • Crafted by Aamir Belal Khan
      </footer>
    </div>
  );
}
