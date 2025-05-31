import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiHook } from "../Hooks/authHooks";
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginMutation = ApiHook.useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: "",
      password: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      loginMutation.mutate(formData, {
        onSuccess: (res) => {
          if (res?.status === false) {
            setErrors({
              username: "",
              password: res.message || "Invalid credentials"
            });
          } else {
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            localStorage.setItem("user_id", res.data.user_id);
            localStorage.setItem("username", res.data.name);
            if (res.data.role) {
              window.location.reload();
            }
          }
        },
        onError: (err) => {
          console.log("Login Failed", err);
          setErrors({
            username: "",
            password: "Login failed. Please try again."
          });
        },
        onSettled: () => {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Floating particles with organic movement
  const floatingElements = Array(15).fill(0).map((_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 30) + 10,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      {/* Advanced background animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-gray-200 opacity-10"
            style={{
              width: element.size,
              height: element.size,
              left: element.left,
              top: "100%",
            }}
            animate={{
              top: "-10%",
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Pulse animation with gradient */}
        <motion.div
          className="absolute left-1/2 top-1/4 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full -translate-x-1/2 opacity-0"
          animate={{
            scale: [0, 10, 0],
            opacity: [0.3, 0.1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeOut",
            delay: 2
          }}
        />
      </div>

      {/* Main login container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full border border-gray-100 relative z-10 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gray-100 rounded-full opacity-10"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gray-200 rounded-full opacity-10"></div>

        <div className="mb-8 text-center">
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Task Manager
          </motion.h2>
          <motion.p 
            className="text-gray-500"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Enter your credentials to access the system
          </motion.p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-gray-700 font-medium text-sm mb-2 flex items-center gap-2">
              <User size={16} />
              Username
            </label>
            <div className="relative">
              <input
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 pl-10 py-3 border ${
                  errors.username ? 'border-red-500' : 'border-gray-200'
                } bg-white text-gray-800 rounded-xl focus:outline-none focus:ring-2 ${
                  errors.username ? 'focus:ring-red-300' : 'focus:ring-gray-300'
                } focus:border-transparent placeholder-gray-400 transition-all`}
                placeholder="Enter your username"
              />
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <AnimatePresence>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-xs mt-1 overflow-hidden"
                >
                  {errors.username}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-gray-700 font-medium text-sm mb-2 flex items-center gap-2">
              <Lock size={16} />
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 pl-10 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } bg-white text-gray-800 rounded-xl focus:outline-none focus:ring-2 ${
                  errors.password ? 'focus:ring-red-300' : 'focus:ring-gray-300'
                } focus:border-transparent placeholder-gray-400 transition-all`}
                placeholder="Enter your password"
              />
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-xs mt-1 overflow-hidden"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>


          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-md transition-all ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800'
            } text-white`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;