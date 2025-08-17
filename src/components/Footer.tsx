export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-auto relative overflow-hidden">
   
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">b</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">Bless</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Pets</span>
            </div>
          </div>
          
          <div className="text-center md:text-right space-y-4">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                About Us
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Contact
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Privacy Policy
              </a>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">
                © 2024 Bless Pets. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs">
                Built with Next.js & Petstore API
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Made with ❤️ for the Bless Payments team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
