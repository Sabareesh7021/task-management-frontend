import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ApiHook } from "../Hooks/authHooks";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const loginMutation = ApiHook.useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset error message when user starts typing
    if (errorMessage || !isValidUsername || !isValidPassword) {
      setErrorMessage("");
      setIsValidUsername(true);
      setIsValidPassword(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username) {
      setIsValidUsername(false);
      setErrorMessage("Username is required.");
      return;
    }
    if (!formData.password) {
      setIsValidPassword(false);
      setErrorMessage("Password is required.");
      return;
    }

    loginMutation.mutate(formData, {
      onSuccess: (res) => {
        if (res?.status === false) {
          setErrorMessage(res.message);
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
      }
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);


  const floatingElements = Array(8).fill(0).map((_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 40) + 20, // Random size between 20-60px
    left: `${Math.random() * 95}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15, // Random duration between 15-25s
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-gray-200 opacity-20"
            style={{
              width: element.size,
              height: element.size,
              left: element.left,
              top: "100%",
            }}
            animate={{
              top: "-10%",
              rotate: [0, 360],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Medical cross symbol animation */}
        <motion.div
          className="absolute"
          style={{ top: "20%", left: "10%" }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <rect x="40" y="20" width="20" height="60" fill="rgba(0,0,0,0.1)" rx="5" />
            <rect x="20" y="40" width="60" height="20" fill="rgba(0,0,0,0.1)" rx="5" />
          </svg>
        </motion.div>
        
        <motion.div
          className="absolute"
          style={{ bottom: "15%", right: "15%" }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 6,
            delay: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="80" height="80" viewBox="0 0 100 100">
            <rect x="40" y="20" width="20" height="60" fill="rgba(0,0,0,0.1)" rx="5" />
            <rect x="20" y="40" width="60" height="20" fill="rgba(0,0,0,0.1)" rx="5" />
          </svg>
        </motion.div>
        
        {/* Pulse animation */}
        <motion.div
          className="absolute left-1/2 top-1/4 w-4 h-4 bg-gray-300 rounded-full -translate-x-1/2"
          animate={{
            scale: [1, 3, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* HMS Logo or Title Animation */}
      <motion.div 
        className="absolute top-10 text-center w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full border border-gray-100 relative z-10"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {forgotPassword ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-gray-500 text-sm">
            {forgotPassword
              ? "Enter your username to reset password"
              : "Sign in to app"}
          </p>
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex items-center justify-center bg-red-100 text-red-600 px-4 py-2 rounded text-sm"
          >
            {errorMessage}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium text-sm mb-1"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${isValidUsername ? 'border-gray-200' : 'border-red-500'} bg-white text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent placeholder-gray-400 transition-all`}
                  placeholder="Enter your username"
                />
              </div>
            </motion.div>

            {!forgotPassword && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium text-sm mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${isValidPassword ? 'border-gray-200' : 'border-red-500'} bg-white text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent placeholder-gray-400 transition-all`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>
            )}
          </div>


          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-gray-700 to-black text-white py-3 rounded-xl font-semibold shadow-lg hover:from-gray-800 hover:to-gray-900 transition-all"
          >
            {forgotPassword ? "Reset Password" : "Sign in"}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {forgotPassword ? (
              <button
                type="button"
                onClick={() => setForgotPassword(false)}
                className="text-gray-700 hover:text-black transition-colors bg-transparent border-none p-0 cursor-pointer focus:outline-none focus:underline"
              >
                Back to login
              </button>
            ) : (
              <>
                Need an account?{" "}
                <a
                  href="your-contact-link-here"
                  className="text-gray-700 hover:text-black transition-colors"
                >
                  Contact administrator
                </a>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;