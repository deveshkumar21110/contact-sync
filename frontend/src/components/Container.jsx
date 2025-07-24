import React from 'react'

function Container({ children }) {
  return (
    <div className="w-full rounded-xl px-4 py-6 bg-white">
      {children}
    </div>
  );
}

export default Container;
