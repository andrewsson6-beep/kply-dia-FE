import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../../assets/images/sky_mmt.jpg';
import logo from '../../assets/images/mmtlogo.svg';

/**
 * Simple OTP verification screen for forgot password flow (mock).
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits
    const next = [...otp];
    next[idx] = value;
    setOtp(next);
    if (value && idx < otp.length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = e => {
    e.preventDefault();
    if (otp.some(d => d === '')) return; // incomplete
    setIsVerifying(true);
    setTimeout(() => {
      // For now just go back to login after 'verification'
      navigate('/login');
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      <img
        src={bgImage}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-12">
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="App Logo"
            className="h-20 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-white/40 p-8">
          <h1 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Verify OTP
          </h1>
          <p className="text-xs text-center text-gray-500 mb-6">
            Enter the 6-digit code sent to your email address
          </p>
          <form onSubmit={handleVerify} className="space-y-8">
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {otp.map((d, i) => (
                <div key={i} className="flex">
                  <input
                    ref={el => (inputsRef.current[i] = el)}
                    value={d}
                    onChange={e => handleChange(i, e.target.value.slice(-1))}
                    onKeyDown={e => handleKeyDown(e, i)}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-full aspect-square min-h-[52px] sm:min-h-[56px] text-center text-lg font-semibold rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200/60 transition"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={isVerifying || otp.some(d => d === '')}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Back to login
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-[10px] text-white/70 tracking-wide">
          © {new Date().getFullYear()} App. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
