
import React from 'react';
import Clock from './components/Clock';
import Eyes from './components/Eyes';
import Weather from './components/Weather';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 overflow-hidden p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-gray-900 to-purple-900 opacity-50"></div>
      <div className="relative z-10 w-[90vw] max-w-5xl flex flex-col items-center gap-8">
          <div className="h-[40vh] w-full">
            <Eyes />
          </div>
          <div className="h-[40vh] w-full">
            <Clock />
          </div>
          <Weather />
      </div>
    </div>
  );
};

export default App;
