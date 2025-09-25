import React from 'react'

function Container({ children,className="" }) {
  return (
    <div className={`w-full md:rounded-3xl px-4 py-6 ${className}`}>
      {children}
    </div>
  );
}

export default Container;
