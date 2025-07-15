import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {Framer  } from 'lucide-react'
import { toast } from 'react-toastify'

export const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const passwordRef = useRef(null)


  const handlePassword = ()=>
     {
        const pass = passwordRef.current.value.trim();    
        const pattern=/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
        const title="Password Must contain at least one number and one uppercase and lowercase letter and at least 8 or more characters"
        
        if(!pattern.test(pass))
        { // usernameRef.current.classList.remove('border','outline-green-200');
            setError(title);
        }
        else{
            setError("");
            return true
           // passwordRef.current.classList.add('border-1','outline','outline-green-400','border-green-400');
        }
        return false

    }
   

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep(2);
        setTimer(600);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const newPassword= password;

    if(!handlePassword())
    {
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password-otp", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successful!');
        setStep(1);
        navigate('/login');
        setEmail('');
        setOtp('');
        setPassword('');
      } else {
        setError(data.message || 'Reset failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  // Countdown timer
  useEffect(() => {
    if (step === 2 && timer > 0) {
      timerRef.current = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, timer]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <section className="login min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans">
       <p className="p-1 absolute top-8 right-8 md:p-2 flex justify-around gap-1 text-pink-800  text-3xl  font-extrabold max-sm:bg-sky-100 max-sm:rounded-2xl max-sm:p-5"> <Framer />  Startup stn. </p>
      <p className='absolute top-8 left-8 text-md bg-sky-100 hover:text-blue-600 text-pink-800 rounded p-2 font-bold'> <Link to="/login"> Login </Link> </p>
  
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-center text-2xl font-bold text-pink-800">
          Forgot Password
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Enter your email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mt-1 border rounded focus:outline-pink-500"
                placeholder="user@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-pink-700 text-white rounded hover:bg-pink-900"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                OTP <span className="text-xs text-gray-400">({formatTime(timer)} left)</span>
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 mt-1 border rounded focus:outline-pink-500"
                placeholder="Enter OTP"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                New Password
              </label>
              <input
                type="password"
                required
                ref={passwordRef}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1 border rounded focus:outline-pink-500"
                placeholder="New password"
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-pink-700 text-white rounded hover:bg-pink-900"
            >
              Reset Password
            </button>
          </form>
        
        )}
      </div>
    </section>
  );
};
