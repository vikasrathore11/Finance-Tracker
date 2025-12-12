import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (email: string) => {
    localStorage.setItem('currentUser', email);
    setCurrentUser(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return <Dashboard userEmail={currentUser} onLogout={handleLogout} />;
}
