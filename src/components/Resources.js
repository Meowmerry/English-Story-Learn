import React from 'react';

const Resources = () => {
  const resourceCategories = [
    {
      title: 'Grammar Guides',
      icon: '📚',
      color: 'bg-blue-500',
      resources: [
        {
          name: 'English Tenses Guide',
          description: 'Master all 12 English tenses with examples and exercises',
          type: 'Guide'
        },
        {
          name: 'Common Grammar Mistakes',
          description: 'Learn to avoid the most common English grammar errors',
          type: 'Article'
        },
        {
          name: 'Sentence Structure',
          description: 'Understanding basic to advanced sentence patterns',
          type: 'Guide'
        }
      ]
    },
    {
      title: 'Vocabulary',
      icon: '📖',
      color: 'bg-green-500',
      resources: [
        {
          name: 'Essential English Words',
          description: '1000 most common English words for daily conversation',
          type: 'List'
        },
        {
          name: 'Phrasal Verbs',
          description: 'Common phrasal verbs with examples and usage',
          type: 'Guide'
        },
        {
          name: 'Idioms & Expressions',
          description: 'Popular English idioms and their meanings',
          type: 'Reference'
        }
      ]
    },
    {
      title: 'Pronunciation',
      icon: '🎤',
      color: 'bg-purple-500',
      resources: [
        {
          name: 'Phonetic Symbols',
          description: 'Learn International Phonetic Alphabet (IPA) symbols',
          type: 'Guide'
        },
        {
          name: 'American vs British English',
          description: 'Key pronunciation differences between accents',
          type: 'Comparison'
        },
        {
          name: 'Common Pronunciation Errors',
          description: 'Troubleshoot your pronunciation challenges',
          type: 'Guide'
        }
      ]
    },
    {
      title: 'Practice Tools',
      icon: '🛠️',
      color: 'bg-orange-500',
      resources: [
        {
          name: 'Speech Recognition',
          description: 'Practice speaking with instant feedback',
          type: 'Tool'
        },
        {
          name: 'Writing Exercises',
          description: 'Daily writing prompts and exercises',
          type: 'Exercise'
        },
        {
          name: 'Listening Comprehension',
          description: 'Audio exercises with transcripts and questions',
          type: 'Exercise'
        }
      ]
    },
    {
      title: 'Learning Tips',
      icon: '💡',
      color: 'bg-yellow-500',
      resources: [
        {
          name: 'Study Techniques',
          description: 'Effective methods for learning English faster',
          type: 'Article'
        },
        {
          name: 'Daily Practice Routine',
          description: 'Create a sustainable English learning schedule',
          type: 'Guide'
        },
        {
          name: 'Motivation & Goals',
          description: 'Stay motivated and track your progress',
          type: 'Article'
        }
      ]
    },
    {
      title: 'External Resources',
      icon: '🌐',
      color: 'bg-pink-500',
      resources: [
        {
          name: 'BBC Learning English',
          description: 'Free English learning resources and lessons',
          type: 'Website'
        },
        {
          name: 'Cambridge Dictionary',
          description: 'Comprehensive dictionary with audio pronunciation',
          type: 'Website'
        },
        {
          name: 'YouTube Channels',
          description: 'Curated list of helpful English learning channels',
          type: 'List'
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">Learning Resources</h1>
        <p className="text-lg text-gray-600">
          Explore our comprehensive collection of resources to support your English
          learning journey. From grammar guides to practice tools, everything you need
          is here.
        </p>
      </div>

      <div className="space-y-8">
        {resourceCategories.map((category, index) => (
          <div key={index} className="card">
            <div className="flex items-center mb-4">
              <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4`}>
                {category.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{category.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {category.resources.map((resource, resourceIndex) => (
                <div
                  key={resourceIndex}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 hover:border-primary-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800 text-sm">
                      {resource.name}
                    </h3>
                    <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 border border-gray-300">
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Study Tips Card */}
      <div className="card mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🎯 Study Tips for Success
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-primary-600 font-bold">1.</span>
            <p>Practice every day, even if just for 15 minutes</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600 font-bold">2.</span>
            <p>Focus on all four skills: listening, speaking, reading, writing</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600 font-bold">3.</span>
            <p>Learn vocabulary in context, not isolated words</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600 font-bold">4.</span>
            <p>Don't be afraid to make mistakes - they're part of learning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
