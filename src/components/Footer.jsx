import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-praise text-4xl text-black">The Cookie Box</h3>
            <p className="font-poppins text-gray-600 mt-2">Santa Fe Capital, Argentina</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/thecookiebox.sf/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de The Cookie Box"
              className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center border border-black transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <circle cx="17.5" cy="6.5" r="1.5" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="font-poppins text-gray-500 text-sm">© {new Date().getFullYear()} The Cookie Box. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


