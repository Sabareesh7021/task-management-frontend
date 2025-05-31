import { Link } from 'react-router-dom';

const Navbar = () => {
  const username = localStorage.getItem('username') || 'User';

  return (
    <header className="bg-black text-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Welcome</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none">
              <span className="text-sm font-medium">{username}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;