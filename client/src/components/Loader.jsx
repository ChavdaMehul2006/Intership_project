import React from 'react';

const Loader = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-10 h-10 border-4 border-aura-200 border-t-aura-600 rounded-full animate-spin" />
    <p className="text-gray-500 text-sm">{label}</p>
  </div>
);

export default Loader;
