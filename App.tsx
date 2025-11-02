import React from 'react';

const App: React.FC = () => {
  return (
    <main className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans">
      <div className="text-center p-12 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 pb-2">
          Hello, YHacks!
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Welcome to your first React & TypeScript application.
        </p>
      </div>
    </main>
  );
};

export default App;