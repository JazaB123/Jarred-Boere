import React from 'react';
import CyberneticGridShader from './components/ui/cybernetic-grid-shader';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="relative min-h-screen">
      <CyberneticGridShader />
      <div className="relative z-10">
        <HomePage />
      </div>
    </div>
  );
}

export default App;
