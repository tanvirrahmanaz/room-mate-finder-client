// src/components/HowItWorks.jsx

import React from 'react';
import { UserPlus, Search, Handshake } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus className="w-12 h-12 text-primary" />,
    title: 'Create Your Profile',
    description: 'Sign up for free and create a detailed profile about your lifestyle, preferences, and what you are looking for in a roommate.',
  },
  {
    icon: <Search className="w-12 h-12 text-primary" />,
    title: 'Search & Filter',
    description: 'Browse through thousands of listings with advanced filters like location, budget, habits, and more to find the perfect match.',
  },
  {
    icon: <Handshake className="w-12 h-12 text-primary" />,
    title: 'Connect & Move In',
    description: 'Once you find a potential match, connect with them through our secure chat and schedule a visit. Find your new home!',
  },
];

const HowItWorks = () => {
  return (
    <div className="py-12 bg-base-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-base-content sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-base-content/70">
            Finding your perfect roommate is as easy as 1-2-3.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6 bg-base-100 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mx-auto">
                {step.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-base-content">{step.title}</h3>
              <p className="mt-2 text-base text-base-content/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;