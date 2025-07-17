import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin, FaBehance } from 'react-icons/fa';

const quickLinks = [
  { name: 'About', to: 'about' },
  { name: 'Skills', to: 'skills' },
  { name: 'Projects', to: 'projects' },
  { name: 'Contact', to: 'contact' },
];

const socialLinks = [
  {
    name: 'GitHub',
    icon: FaGithub,
    url: 'https://github.com/yourusername',
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    url: 'https://linkedin.com/in/yourusername',
  },
  {
    name: 'Behance',
    icon: FaBehance,
    url: 'https://behance.net/yourusername',
  },
];

const Footer = () => {
  return (
    <footer className="bg-primary-dark/5 dark:bg-primary-light/5 py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-space font-bold bg-gradient-to-r from-accent-blue via-accent-purple to-accent-green bg-clip-text text-transparent mb-4">
              Hafiz Al Asad
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80">
              Where Logic Meets Aesthetics
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className="cursor-pointer hover:text-accent-blue transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-light/80 dark:text-text-dark/80 hover:text-accent-blue transition-colors"
                >
                  <link.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-dark/10 dark:border-primary-light/10 text-center text-text-light/60 dark:text-text-dark/60">
          <p>
            © {new Date().getFullYear()} Hafiz Al Asad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 