import React from 'react'

function Container({ children,className="" }) {
  return (
    <div className={`w-full rounded-3xl px-4 py-6 bg-white ${className}`}>
      {children}
    </div>
  );
}

export default Container;
