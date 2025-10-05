import React from 'react';
import Clock from './components/Clock';
import Eyes from './components/Eyes';
import Weather from './components/Weather';
import RssFeed from './components/RssFeed';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 overflow-hidden p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-gray-900 to-purple-900 opacity-50"></div>
      <div className="relative z-10 w-[90vw] max-w-7xl flex flex-col items-center gap-8">
          <div className="h-[30vh] w-full">
            <Eyes />
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3 h-[40vh]">
                  <Clock />
              </div>
              <div className="w-full lg:w-1/3 h-[40vh]">
                  <RssFeed />
              </div>
          </div>
          <Weather />
      </div>
    </div>
  );
};

export default App;
