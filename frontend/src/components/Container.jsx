import React from 'react'

function Container({ children }) {
  return (
    <div className="w-full rounded-xl shadow-lg max-w-7xl mx-auto px-4 py-6 bg-white">
      {children}
    </div>
  );
}

export default Container;
