import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { DashboardPage } from './components/DashboardPage';
import { createClient } from './utils/supabase/client';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'login' | 'register' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      if (data.session && !error) {
        setAccessToken(data.session.access_token);
        setUser(data.session.user);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Ошибка проверки сессии:', error);
    } finally {
      setCheckingSession(false);
    }
  };

  const handleLoginSuccess = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setAccessToken(null);
      setUser(null);
      setCurrentPage('home');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'home' && (
        <HomePage onGetStarted={() => setCurrentPage('register')} />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage
          onRegisterSuccess={() => setCurrentPage('login')}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'dashboard' && accessToken && user && (
        <DashboardPage
          accessToken={accessToken}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <Toaster />
    </>
  );
}
