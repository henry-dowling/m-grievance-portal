'use client';
import { useState, useEffect } from "react";
import Head from 'next/head';

interface Grievance {
  grievance: string;
  mood: string;
  severity: number;
  date: string;
  username?: string;
}

function Login({ onLogin }: { onLogin: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  function handleLogin() {
    if (username.trim().toLowerCase() === "meia") {
      setError("");
      onLogin("meia");
    } else {
      setError("Invalid username");
    }
  }
  return (
    <div className="bg-white/80 rounded-3xl p-10 shadow-2xl flex flex-col items-center max-w-sm mx-auto mt-24 animate-fadein border border-pink-200 backdrop-blur-md">
      <h2 className="text-3xl font-extrabold mb-2 text-pink-700 flex items-center gap-2">Meia&apos;s Grievance Portal <span>💌</span></h2>
      <p className="mb-6 text-pink-600 text-lg">Log in to submit your grievances! <span>✨</span></p>
      <input
        className="mb-3 p-3 rounded-xl border border-pink-200 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-lg bg-white/70 placeholder-pink-300"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      {error && <div className="text-red-500 mb-2 font-semibold">{error}</div>}
      <button
        className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-3 rounded-xl mt-2 hover:scale-105 hover:shadow-lg transition-all font-bold text-lg shadow-pink-200"
        onClick={handleLogin}
      >
        Log In 🚪
      </button>
    </div>
  );
}

function GrievanceForm({ onSubmit, username, onLogout }: { onSubmit: (g: Grievance) => void, username: string, onLogout: () => void }) {
  const [grievance, setGrievance] = useState("");
  const [mood, setMood] = useState("😡");
  const [severity, setSeverity] = useState(2);
  return (
    <div className="bg-white/80 rounded-3xl p-10 shadow-2xl flex flex-col items-center max-w-sm mx-auto mt-24 relative animate-fadein border border-pink-200 backdrop-blur-md">
      <button
        className="absolute top-4 right-4 text-pink-400 hover:text-pink-700 text-sm underline font-semibold transition-all"
        onClick={onLogout}
      >
        Logout 🚪
      </button>
      <h2 className="text-3xl font-extrabold mb-2 text-pink-700 flex items-center gap-2">Welcome, {username} <span>👋</span></h2>
      <p className="mb-4 text-pink-600 text-lg">Pls submit grievance here <span>📝</span></p>
      <textarea className="mb-3 p-3 rounded-xl border border-pink-200 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-lg bg-white/70 placeholder-pink-300 min-h-[80px]" placeholder="What&apos;s bothering you?" value={grievance} onChange={e => setGrievance(e.target.value)} />
      <div className="mb-3 w-full flex items-center justify-between">
        <label className="font-semibold">Mood:</label>
        <select value={mood} onChange={e => setMood(e.target.value)} className="rounded-xl p-2 border border-pink-200 bg-white/70 focus:ring-2 focus:ring-pink-400 transition-all text-lg">
          <option>😡</option>
          <option>😢</option>
          <option>😐</option>
          <option>🥺</option>
          <option>😂</option>
        </select>
      </div>
      <div className="mb-6 w-full flex items-center justify-between">
        <label className="font-semibold">Severity:</label>
        <input type="range" min={1} max={5} value={severity} onChange={e => setSeverity(Number(e.target.value))} className="accent-pink-500 w-32" />
        <span className="ml-2 font-bold text-pink-600 text-lg">{severity}</span>
      </div>
      <button className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-3 rounded-xl hover:scale-105 hover:shadow-lg transition-all font-bold text-lg shadow-pink-200 w-full flex items-center justify-center gap-2" onClick={() => grievance && onSubmit({ grievance, mood, severity, date: new Date().toISOString() })}>
        Submit Grievance <span>📨</span>
      </button>
    </div>
  );
}

function ThankYou({ onAnother, username, onLogout }: { onAnother: () => void, username: string, onLogout: () => void }) {
  return (
    <div className="bg-white/80 rounded-3xl p-10 shadow-2xl flex flex-col items-center max-w-sm mx-auto mt-24 relative animate-fadein border border-pink-200 backdrop-blur-md">
      <button
        className="absolute top-4 right-4 text-pink-400 hover:text-pink-700 text-sm underline font-semibold transition-all"
        onClick={onLogout}
      >
        Logout 🚪
      </button>
      <h2 className="text-3xl font-extrabold mb-2 text-pink-700 flex items-center gap-2">Thank you, {username} <span>💖</span></h2>
      <p className="mb-6 text-pink-600 text-lg text-center">Your grievance has been sent to Henry <span>💌</span><br/>He will get back to you asap depending on severity level <span>⏳</span></p>
      <button className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-3 rounded-xl hover:scale-105 hover:shadow-lg transition-all font-bold text-lg shadow-pink-200 mt-2 flex items-center gap-2" onClick={onAnother}>
        Submit Another <span>➕</span>
      </button>
    </div>
  );
}

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("meia-username");
    if (saved) setUsername(saved);
  }, []);

  function handleLogin(name: string) {
    setUsername(name);
    localStorage.setItem("meia-username", name);
  }

  async function handleSubmit(grievanceObj: Grievance) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/submit-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...grievanceObj, username }),
      });
      if (!response.ok) {
        throw new Error('Failed to send grievance');
      }
      const prev = JSON.parse(localStorage.getItem("meia-grievances") || "[]");
      localStorage.setItem("meia-grievances", JSON.stringify([...prev, { ...grievanceObj, username }]));
      setSubmitted(true);
    } catch {
      setError('Failed to submit grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleAnother() {
    setSubmitted(false);
  }

  function handleLogout() {
    setUsername(null);
    localStorage.removeItem("meia-username");
  }

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        html, body {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffe0f7 0%, #fbeaff 50%, #ffe5ec 100%);
          font-family: 'Poppins', sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(.4,2,.6,1) both;
        }
      `}</style>
      {!username && <Login onLogin={handleLogin} />}
      {username && submitted && <ThankYou onAnother={handleAnother} username={username} onLogout={handleLogout} />}
      {username && !submitted && <GrievanceForm onSubmit={handleSubmit} username={username} onLogout={handleLogout} />}
      {loading && <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 z-50"><div className="bg-pink-100 p-6 rounded-xl shadow-lg text-pink-700 font-bold text-lg">Submitting...</div></div>}
      {error && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-xl shadow-lg font-semibold">{error}</div>}
    </>
  );
}
