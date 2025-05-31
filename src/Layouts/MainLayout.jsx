import { Outlet } from 'react-router-dom';
import Navbar from '../Components/common/Navbar';
import Sidebar from '../Components/common/Sidebar';
import Footer from '../Components/common/Footer';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-20"> {/* Added ml-20 to account for sidebar width */}
        {/* Navbar */}
        <Navbar />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;