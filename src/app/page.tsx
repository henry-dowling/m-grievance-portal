'use client';
import { useState, useEffect } from "react";

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
    <div className="bg-pink-100 rounded-xl p-8 shadow-lg flex flex-col items-center max-w-sm mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-2 text-pink-700">Meia's Grievance Portal 💌</h2>
      <p className="mb-4 text-pink-600">Log in to submit your grievances!</p>
      <input
        className="mb-2 p-2 rounded border w-full"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        className="bg-pink-500 text-white px-4 py-2 rounded mt-2 hover:bg-pink-600"
        onClick={handleLogin}
      >
        Log In
      </button>
    </div>
  );
}

function GrievanceForm({ onSubmit, username }: { onSubmit: (g: any) => void, username: string }) {
  const [grievance, setGrievance] = useState("");
  const [mood, setMood] = useState("😡");
  const [severity, setSeverity] = useState(2);
  return (
    <div className="bg-pink-100 rounded-xl p-8 shadow-lg flex flex-col items-center max-w-sm mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-2 text-pink-700">Welcome to the Grievance Portal, {username}</h2>
      <p className="mb-4 text-pink-600">Pls submit grievance here</p>
      <textarea className="mb-2 p-2 rounded border w-full" placeholder="What's bothering you?" value={grievance} onChange={e => setGrievance(e.target.value)} />
      <div className="mb-2 w-full flex items-center justify-between">
        <label>Mood:</label>
        <select value={mood} onChange={e => setMood(e.target.value)} className="rounded p-1">
          <option>😡</option>
          <option>😢</option>
          <option>😐</option>
          <option>🥺</option>
          <option>😂</option>
        </select>
      </div>
      <div className="mb-4 w-full flex items-center justify-between">
        <label>Severity:</label>
        <input type="range" min={1} max={5} value={severity} onChange={e => setSeverity(Number(e.target.value))} />
        <span>{severity}</span>
      </div>
      <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full" onClick={() => grievance && onSubmit({ grievance, mood, severity, date: new Date().toISOString() })}>
        Submit Grievance
      </button>
    </div>
  );
}

function ThankYou({ onAnother, username }: { onAnother: () => void, username: string }) {
  return (
    <div className="bg-pink-100 rounded-xl p-8 shadow-lg flex flex-col items-center max-w-sm mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-2 text-pink-700">Thank you, {username} 💖</h2>
      <p className="mb-4 text-pink-600">Your grievance has been sent to Henry 💌<br/>He will get back to you asap depending on severity level<br/></p>
      <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 mt-2" onClick={onAnother}>
        Submit Another
      </button>
    </div>
  );
}

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("meia-username");
    if (saved) setUsername(saved);
  }, []);

  function handleLogin(name: string) {
    setUsername(name);
    localStorage.setItem("meia-username", name);
  }

  function handleSubmit(grievanceObj: any) {
    const prev = JSON.parse(localStorage.getItem("meia-grievances") || "[]");
    localStorage.setItem("meia-grievances", JSON.stringify([...prev, { ...grievanceObj, username }]));
    setSubmitted(true);
  }

  function handleAnother() {
    setSubmitted(false);
  }

  if (!username) return <Login onLogin={handleLogin} />;
  if (submitted) return <ThankYou onAnother={handleAnother} username={username} />;
  return <GrievanceForm onSubmit={handleSubmit} username={username} />;
}
