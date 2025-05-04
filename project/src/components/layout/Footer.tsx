import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="text-blue-400">
                <Database size={28} />
              </div>
              <span className="font-bold text-xl text-white">TabulaX</span>
            </Link>
            <p className="text-slate-300 text-sm">
              AI-powered table transformation tool that converts your data seamlessly.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="mailto:info@tabulax.io" className="text-slate-300 hover:text-white transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg text-white">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-slate-300 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/demo" className="text-slate-300 hover:text-white transition-colors">Try Demo</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg text-white">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Research Paper</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg text-white">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} TabulaX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;