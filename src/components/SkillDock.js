import React from 'react';

const SkillDock = ({ selectedMode, onModeChange }) => {
  const skills = [
    {
      id: 'listening',
      name: 'Listening',
      icon: '👂',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Listen and answer questions'
    },
    {
      id: 'speaking',
      name: 'Speaking',
      icon: '🗣️',
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Practice pronunciation'
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: '📖',
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Read with interactive subtitles'
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: '✍️',
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Type what you hear'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Choose Your Learning Mode
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => onModeChange(skill.id)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-xl
              transition-all duration-300 transform
              ${selectedMode === skill.id
                ? `${skill.color} text-white shadow-lg scale-105`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }
            `}
          >
            <div className="text-4xl mb-2">{skill.icon}</div>
            <div className="font-semibold text-sm mb-1">{skill.name}</div>
            <div className="text-xs opacity-80 text-center">
              {skill.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SkillDock;
