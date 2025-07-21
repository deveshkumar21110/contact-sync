import React from 'react'
function Container({ children }) {
  return (
    <div className="w-full rounded-xl shadow-lg max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white">
        {children}
      </div>
    </div>
  );
}
export default Container;