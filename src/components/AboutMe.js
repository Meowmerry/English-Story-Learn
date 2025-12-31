import React from 'react';

const AboutMe = () => {
  const socialLinks = [
    {
      name: 'Portfolio',
      url: 'https://portfoilo-thansanee.netlify.app/',
      icon: '🌐',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/thasanee-p-686125243/',
      icon: '💼',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Meowmerry',
      icon: '👨‍💻',
      color: 'bg-gray-800 hover:bg-gray-900'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@MeowAIExperiments',
      icon: '📺',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/meowmerry/',
      icon: '📷',
      color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/LearningEnglishBymyself/',
      icon: '👍',
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="card mb-8">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">About Me</h1>
        <div className="prose max-w-none text-gray-700">
          <p className="text-lg mb-4">
            Hello! I'm Thasanee, a software developer and AI enthusiast, and the creator
            of StoryFlow. I'm passionate about building innovative solutions that make
            English learning accessible and engaging through interactive technology.
          </p>
          <p className="text-lg mb-4">
            As a software engineer with a deep passion for artificial intelligence, I love
            exploring how AI can revolutionize education. I combine my technical expertise
            in web development, machine learning, and natural language processing to create
            interactive learning experiences. This platform showcases how modern web
            technologies and AI-powered features can transform language learning across
            all four skills: listening, speaking, reading, and writing.
          </p>
          <p className="text-lg">
            Through my work, I experiment with cutting-edge AI technologies to make language
            learning more personalized, effective, and fun. I believe AI has the potential to
            democratize education and help learners around the world achieve their goals.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Connect With Me</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} text-white rounded-lg p-4 flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="font-semibold">{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="card mt-8 bg-primary-50 border-2 border-primary-200">
        <p className="text-center text-gray-700">
          Feel free to reach out on any of these platforms. I'd love to hear your
          feedback and suggestions for improving StoryFlow!
        </p>
      </div>
    </div>
  );
};

export default AboutMe;
