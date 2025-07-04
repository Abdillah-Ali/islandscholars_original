import React from 'react';
import { Mail, Github, Linkedin, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-black text-primary-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-red to-accent-pink rounded-lg flex items-center justify-center">
                <span className="text-primary-white font-bold text-sm">IS</span>
              </div>
              <span className="text-xl font-bold">Island Scholars</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Connecting Tanzanian university students with meaningful internship opportunities 
              to fulfill their academic requirements and gain real-world experience.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/internships" className="text-neutral-400 hover:text-accent-pink transition-colors">Browse Internships</a></li>
              <li><a href="/organizations" className="text-neutral-400 hover:text-accent-pink transition-colors">Partner Organizations</a></li>
              <li><a href="/signin" className="text-neutral-400 hover:text-accent-pink transition-colors">Sign In</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-accent-pink" />
                <a href="mailto:Abdillah@islandscholars.com" className="text-neutral-400 hover:text-primary-white transition-colors">
                  Abdillah@islandscholars.com
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4 text-accent-pink" />
                <a href="https://github.com/Abdillah-Ali" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-white transition-colors">
                  github.com/Abdillah-Ali
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Linkedin className="w-4 h-4 text-accent-pink" />
                <a href="https://www.linkedin.com/in/ali-abdillah" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-white transition-colors">
                  linkedin.com/in/ali-abdillah
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-accent-pink" />
                <span className="text-neutral-400">Suza, Tunguu, Zanzibar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
          <p className="text-neutral-400 text-sm">
            © 2024 Island Scholars Platform. Built to empower Tanzanian students through meaningful internship experiences.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;