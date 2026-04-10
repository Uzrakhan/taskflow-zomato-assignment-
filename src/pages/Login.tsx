import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/projects');
      }
    } catch (error) {
      alert("Login failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-emerald-50">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-emerald-100 rounded-full mb-4">
            <Leaf className="text-emerald-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to TaskFlow</h1>
          <p className="text-slate-500 text-sm">Greening India Tech Team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" required
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="uzra@zomato.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" required
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-3 rounded-lg transition-colors flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}