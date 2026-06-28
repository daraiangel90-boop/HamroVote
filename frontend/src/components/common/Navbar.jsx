// frontend/src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import logo from '../../assets/images/vote_logo1.png';
import Button from './Button';

const Navbar = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const { isConnected, connectWallet, loading, error, address } = useWeb3();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };  
    const handleConnectWallet = async () => {
    const result = await connectWallet();
    if (!result.success) {
      console.error('Wallet connection failed:', result.message);
    }
  };

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };


  return (
    <nav className="fixed top-0 w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900/95 backdrop-blur-md z-50 border-b border-white/10 shadow-lg">
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-17">
          
          {/* Left: Logo + Title */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img
               src={logo}
               alt="HamroVote"
              className="h-12 w-12 rounded-full object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20"
          />
              <span
                className="
                 text-3xl
                 font-black 
                 tracking-tight
                 bg-gradient-to-r
                from-cyan-300
                via-blue-400
                to-cyan-400
                 bg-clip-text
                 text-transparent
                  "
              >
                {t('app.title')}
              </span>
          </Link>

          {/* Center: Navigation Links (using Button for consistency) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-auto mr-6">
            {isAuthenticated && (
              <>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="ghost"
                  size="m"
                  className="px-3"
                >
                  Dashboard
                </Button>

                <Button
                  onClick={() => navigate('/vote')}
                  variant="ghost"
                  size="m"
                  className="px-3"
                >
                  Vote
                </Button>

                <Button
                  onClick={() => navigate('/profile')}
                  variant="ghost"
                  size="m"
                  className="px-3"
                >
                  Profile
                </Button>

                <Button
                  onClick={() => navigate('/results')}
                  variant="ghost"
                  size="m"
                  className="px-3"
                >
                  Results
                </Button>
              </>
            )}
          </div>
          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="font-medium text-gray-200 hover:text-red-400 px-5 py-2 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="font-medium text-slate-300 hover:text-cyan-400 px-5 py-2 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Single Primary Button */}
            {!isAuthenticated && (
              <Button onClick={() => navigate('/register')} variant="primary" size="md">
                Get Started
              </Button>
            )}

            {!isConnected && (
              <Button onClick={connectWallet} variant="secondary" size="md">
                Connect Wallet
              </Button>
            )}


          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-gray-200 hover:bg-slate-800 rounded-lg transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-t border-white/10 py-6">
          <div className="px-6 space-y-4">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block py-3 text-slate-300 hover:text-cyan-400 font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/vote" className="block py-3 text-slate-300 hover:text-cyan-400 font-medium" onClick={() => setIsMenuOpen(false)}>Vote</Link>
                <Link to="/profile" className="block py-3 text-slate-300 hover:text-cyan-400 font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <Link to="/results" className="block py-3 text-slate-300 hover:text-cyan-400 font-medium" onClick={() => setIsMenuOpen(false)}>Results</Link>
              </>
            )}

            <div className="pt-4 border-t border-white/10 space-y-3">
              <LanguageSwitcher />

              {isAuthenticated ? (
                <button onClick={handleLogout} className="block w-full py-3 text-red-600 font-medium">Logout</button>
              ) : (
                <Link to="/login" className="block w-full py-3 text-center font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
              )}



              {!isConnected && (
                <Button 
                  onClick={() => { connectWallet(); setIsMenuOpen(false); }} 
                  variant="secondary" 
                  className="w-full"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;