const Footer = () => {
    return (
      <footer className="bg-black text-white py-4 px-6 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    );
  };
  
export default Footer;