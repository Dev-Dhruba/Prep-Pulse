'use client';
import React from 'react';

const MyInterviews = () => {
  const recentInterviews = [
    {
      role: 'Frontend Engineer',
      level: 'Easy',
      questions: 10,
      image: 'images/cover.jpg',
    },
    {
      role: 'Backend Developer',
      level: 'Medium',
      questions: 15,
      image: 'images/cover.jpg',
    },
    {
      role: 'DSA Round',
      level: 'Hard',
      questions: 12,
      image: 'images/cover.jpg',
    },
  ];

  const previousInterviews = [
    {
      role: 'Software Engineer',
      level: 'Medium',
      questions: 8,
      image: 'images/cover.jpg',
    },
    {
      role: 'System Design',
      level: 'Hard',
      questions: 5,
      image: 'images/cover.jpg',
    },
    {
      role: 'HR Round',
      level: 'Easy',
      questions: 7,
      image: 'images/cover.jpg',
    },
  ];

  const InterviewCard = ({ role, level, questions, image }: any) => (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#333] hover:shadow-[0_0_20px_#2563eb] transition-all duration-300">
      <img src={image} alt={role} className="rounded-lg w-full h-32 object-cover mb-4" />
      <p className="text-sm text-gray-400">Role: <span className="text-white">{role}</span></p>
      <p className="text-sm text-gray-400">Level: <span className="text-white">{level}</span></p>
      <p className="text-sm text-gray-400 mb-4">Questions: <span className="text-white">{questions}</span></p>
      <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-white text-sm w-full">
        {level === 'Easy' ? 'Start Interview' : 'View Summary'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Your Interviews</h2>

      {/* Recent Interviews */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-white">Recent Interviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentInterviews.map((item, index) => (
            <InterviewCard key={index} {...item} />
          ))}
        </div>
      </div>

      {/* Previous Interviews */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Previous Interviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previousInterviews.map((item, index) => (
            <InterviewCard key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyInterviews;
