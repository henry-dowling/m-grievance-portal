'use client';
import { useState, useEffect } from "react";
import Head from 'next/head';
import confetti from 'canvas-confetti';

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
    <div className="bg-white/80 rounded-3xl p-10 shadow-2xl flex flex-col items-center max-w-sm mx-auto mt-24 animate-fadein border border-pink-200 backdrop-blur-md animate-card">
      <h2 className="text-3xl font-extrabold mb-2 text-pink-700 flex items-center gap-2">Meia&apos;s Grievance Portal <span className="bounce-emoji">💌</span></h2>
      <p className="mb-6 text-pink-600 text-lg">Log in to submit your grievances! <span>✨</span></p>
      <input
        className="mb-3 p-3 rounded-xl border border-pink-200 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-lg bg-white/70 placeholder-pink-300"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      {error && <div className="text-red-500 mb-2 font-semibold">{error}</div>}
      <button
        className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-3 rounded-xl mt-2 hover:scale-105 hover:shadow-lg transition-all font-bold text-lg shadow-pink-200 viral-btn"
        onClick={handleLogin}
      >
        Log In 🚪
      </button>
    </div>
  );
}

function GrievanceForm({ onSubmit, username, onLogout }: { onSubmit: (g: Grievance, file?: File) => void, username: string, onLogout: () => void }) {
  const [grievance, setGrievance] = useState("");
  const [mood, setMood] = useState("😡");
  const [severity, setSeverity] = useState(2);
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="bg-white/80 rounded-3xl p-10 shadow-2xl flex flex-col items-center max-w-sm mx-auto mt-24 relative animate-fadein border border-pink-200 backdrop-blur-md animate-card">
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
      <div className="mb-3 w-full flex items-center justify-between">
        <label className="font-semibold">Screenshot:</label>
        <div className="flex items-center gap-2 w-full justify-end">
          <input
            id="screenshot-upload"
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="screenshot-upload"
            className="flex items-center gap-1 bg-white/70 border border-pink-200 text-pink-600 px-3 py-1 rounded-lg cursor-pointer font-semibold shadow-sm hover:bg-pink-100 hover:text-pink-700 transition-all text-base"
            title="Upload a screenshot"
          >
            <span role="img" aria-label="camera">📷</span>
            <span>{file ? 'Change' : 'Upload'}</span>
          </label>
          {file && (
            <span
              className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs max-w-[120px] truncate shadow-sm border border-pink-200"
              title={file.name}
            >
              {file.name}
            </span>
          )}
        </div>
      </div>
      <div className="mb-6 w-full flex items-center justify-between">
        <label className="font-semibold">Severity:</label>
        <input type="range" min={1} max={5} value={severity} onChange={e => setSeverity(Number(e.target.value))} className="accent-pink-500 w-32" />
        <span className="ml-2 font-bold text-pink-600 text-lg">{severity}</span>
      </div>
      <button className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-3 rounded-xl hover:scale-105 hover:shadow-lg transition-all font-bold text-lg shadow-pink-200 w-full flex items-center justify-center gap-2 viral-btn" onClick={() => grievance && onSubmit({ grievance, mood, severity, date: new Date().toISOString() }, file || undefined)}>
        Submit Grievance <span>📨</span>
      </button>
    </div>
  );
}

function ThankYou({ onAnother, username, onLogout }: { onAnother: () => void, username: string, onLogout: () => void }) {
  return (
    <div className="bg-white/80 rounded-3xl p-10 shadow-2xl flex flex-col items-center max-w-sm mx-auto mt-24 relative animate-fadein border border-pink-200 backdrop-blur-md animate-card">
      <button
        className="absolute top-4 right-4 text-pink-400 hover:text-pink-700 text-sm underline font-semibold transition-all"
        onClick={onLogout}
      >
        Logout 🚪
      </button>
      <h2 className="text-3xl font-extrabold mb-2 text-pink-700 flex items-center gap-2">Thank you, {username} <span className="bounce-emoji">💖</span></h2>
      <p className="mb-6 text-pink-600 text-lg text-center">Your grievance has been sent to Henry <span>💌</span><br/>He will get back to you asap depending on severity level <span>⏳</span></p>
      <button className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-3 rounded-xl hover:scale-105 hover:shadow-lg transition-all font-bold text-lg shadow-pink-200 mt-2 flex items-center gap-2 viral-btn" onClick={onAnother}>
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

  useEffect(() => {
    if (submitted) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        scalar: 1.2,
      });
    }
  }, [submitted]);

  function handleLogin(name: string) {
    setUsername(name);
    localStorage.setItem("meia-username", name);
  }

  async function handleSubmit(grievanceObj: Grievance, file?: File) {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('grievance', grievanceObj.grievance);
      formData.append('mood', grievanceObj.mood);
      formData.append('severity', grievanceObj.severity.toString());
      formData.append('date', grievanceObj.date);
      if (username) formData.append('username', username);
      if (file) formData.append('screenshot', file);
      const response = await fetch('/api/submit-grievance', {
        method: 'POST',
        body: formData,
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
        .floating-emoji-bg {
          pointer-events: none;
        }
        .floating-emoji {
          position: absolute;
          bottom: -40px;
          font-size: 2.2rem;
          opacity: 0.7;
          animation: floatUp 8s linear infinite;
        }
        .emoji-1 { font-size: 2.8rem; opacity: 0.8; }
        .emoji-3 { font-size: 2.5rem; opacity: 0.6; }
        .emoji-5 { font-size: 2.3rem; opacity: 0.7; }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1) rotate(-10deg); opacity: 0.7; }
          60% { opacity: 1; }
          100% { transform: translateY(-110vh) scale(1.2) rotate(10deg); opacity: 0; }
        }
        .bounce-emoji {
          display: inline-block;
          animation: bouncePulse 1.2s infinite cubic-bezier(.4,2,.6,1);
        }
        @keyframes bouncePulse {
          0%, 100% { transform: scale(1) translateY(0); }
          30% { transform: scale(1.2) translateY(-8px); }
          50% { transform: scale(0.95) translateY(2px); }
          70% { transform: scale(1.1) translateY(-4px); }
        }
        .animate-card {
          animation: cardIn 0.8s cubic-bezier(.4,2,.6,1) both;
        }
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .viral-btn:hover {
          animation: wiggle 0.4s;
        }
        @keyframes wiggle {
          0% { transform: rotate(-2deg) scale(1.05); }
          25% { transform: rotate(2deg) scale(1.1); }
          50% { transform: rotate(-2deg) scale(1.08); }
          75% { transform: rotate(2deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1.05); }
        }
      `}</style>
      {!username && <Login onLogin={handleLogin} />}
      {username && submitted && <ThankYou onAnother={handleAnother} username={username} onLogout={handleLogout} />}
      {username && !submitted && <GrievanceForm onSubmit={handleSubmit} username={username} onLogout={handleLogout} />}
      {loading && <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 z-50"><div className="bg-pink-100 p-6 rounded-xl shadow-lg text-pink-700 font-bold text-lg">Submitting...</div></div>}
      {error && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-xl shadow-lg font-semibold">{error}</div>}
      {/* Floating Emoji Background - only after submission */}
      {username && submitted && (
        <div className="floating-emoji-bg pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          {['💌','✨','😂','😡','🥺','💖','😢','😐'].map((emoji, i) => (
            <span
              key={i}
              className={`floating-emoji emoji-${i}`}
              style={{ left: `${10 + i * 10}%`, animationDelay: `${i * 1.2}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
