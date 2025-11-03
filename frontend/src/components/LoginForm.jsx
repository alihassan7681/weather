import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiArrowRight, FiX } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const LoginForm = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Different weather backgrounds
  const weatherBackgrounds = [
    'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  ];

  const [currentBackground] = useState(
    weatherBackgrounds[Math.floor(Math.random() * weatherBackgrounds.length)]
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN PROCESS
        const response = await authAPI.login(formData.email, formData.password);
        
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email
        };
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success('Login successful! 🎉', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => {
          onLoginSuccess(userData);
        }, 1000);
        
      } else {
        // REGISTRATION PROCESS
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match! ❌", {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters long! 🔒", {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setLoading(false);
          return;
        }

        const response = await authAPI.register(
          formData.username,
          formData.email,
          formData.password
        );
        
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email
        };
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success('Registration successful! Welcome! 🎉', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => {
          onLoginSuccess(userData);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Auth Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          (isLogin ? 'Login failed! Please check your credentials. ❌' : 'Registration failed! Please try again. ❌');
      
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Weather Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url("${currentBackground}")`
        }}
      ></div>
      
      {/* Dark Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Main Glass Container */}
      <div className="relative backdrop-blur-lg bg-white/15 border border-white/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header with Glass Effect */}
        <div className="backdrop-blur-md bg-white/20 border-b border-white/30 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold drop-shadow-lg">Tech Wave</h2>
              <p className="text-white/90 drop-shadow">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-white/70 transition-colors text-xl backdrop-blur-sm bg-white/20 hover:bg-white/30 p-2 rounded-full border border-white/30"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 z-10" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:border-white/50 focus:bg-white/20 text-white placeholder-white/70 transition-all duration-200"
              />
            </div>
          )}

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 z-10" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:border-white/50 focus:bg-white/20 text-white placeholder-white/70 transition-all duration-200"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 z-10" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full pl-10 pr-4 py-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:border-white/50 focus:bg-white/20 text-white placeholder-white/70 transition-all duration-200"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 z-10" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full pl-10 pr-4 py-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:border-white/50 focus:bg-white/20 text-white placeholder-white/70 transition-all duration-200"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/25 backdrop-blur-sm border border-white/40 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/35 hover:border-white/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                Please wait...
              </div>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 backdrop-blur-md bg-white/15 border-t border-white/30">
          <div className="text-center">
            <span className="text-white/80">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-white font-semibold hover:text-white/90 transition-colors backdrop-blur-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg border border-white/30"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;