import React from 'react';

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-base-content">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-base-content/70 mt-4 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;