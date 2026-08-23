import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { InterviewScheduler } from './components/interview/InterviewScheduler';

function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.hash;
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isInterviewRoute =
    currentPath.startsWith('/interview') ||
    currentPath.includes('#interview') ||
    currentPath.includes('#/interview');

  if (isInterviewRoute) {
    return <InterviewScheduler />;
  }

  return <LandingPage />;
}

export default App;
