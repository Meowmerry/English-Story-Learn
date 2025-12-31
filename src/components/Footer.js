import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Portfolio',
      url: 'https://portfoilo-thansanee.netlify.app/',
      icon: '🌐'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/thasanee-p-686125243/',
      icon: '💼'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Meowmerry',
      icon: '👨‍💻'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@MeowAIExperiments',
      icon: '📺'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/meowmerry/',
      icon: '📷'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/LearningEnglishBymyself/',
      icon: '👍'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-400">StoryFlow</h3>
            <p className="text-gray-400 text-sm">
              Learn English through interactive animated stories. Improve your listening,
              speaking, reading, and writing skills naturally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#stories" className="text-gray-400 hover:text-white transition-colors">
                  Stories
                </a>
              </li>
              <li>
                <a href="#resources" className="text-gray-400 hover:text-white transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About Me
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-400">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:scale-110 transition-transform"
                  title={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} StoryFlow by Thasanee. All rights reserved.
          </p>
          <p className="mt-2">
            Made with ❤️ for English learners everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
