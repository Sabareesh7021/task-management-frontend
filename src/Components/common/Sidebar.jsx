import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  
  const menuItems = [
    {
      name: 'User Management',
      path: '/admin/users/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
      roles: ['super_admin', 'admin']
    },
    {
      name: 'Task',
      path: '/task',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      roles: ['super_admin', 'admin', 'user']
    },
    {
      name: 'Profile',
      path: '/admin/users/profile',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"/>
        </svg>
      ),
      roles: ['super_admin', 'admin', 'user']
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-black flex flex-col items-center py-8 z-40">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
          <span className="text-black font-bold text-xl">T</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col items-center space-y-4 my-auto">
        {menuItems
          .filter(item => item.roles.includes(userRole))
          .map((item) => (
            <div key={item.path} className="relative group">
              <Link
                to={item.path}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  location.pathname === item.path
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
              </Link>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2">
                {item.name}
                {/* Arrow */}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
              </div>
            </div>
          ))}
      </nav>

      {/* User and Logout */}
      <div className="mt-auto flex flex-col items-center space-y-4">
        <div className="relative group">
          <button
            onClick={handleLogout}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
          <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2">
            Logout
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;