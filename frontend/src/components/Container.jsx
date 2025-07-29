import React from 'react'

function Container({ children }) {
  return (
    <div className="w-full rounded-3xl px-4 py-6 bg-white border-8 border-blue">
      {children}
    </div>
  );
}

export default Container;
