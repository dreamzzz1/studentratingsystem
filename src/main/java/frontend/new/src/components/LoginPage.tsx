import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Star, AlertCircle } from 'lucide-react';
import { createClient } from '../utils/supabase/client';

interface LoginPageProps {
  onLoginSuccess: (accessToken: string, user: any) => void;
  onNavigateToRegister: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Ошибка авторизации:', authError);
        setError('Неверный email или пароль');
        setLoading(false);
        return;
      }

      if (data.session) {
        onLoginSuccess(data.session.access_token, data.user);
      }
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError('Произошла ошибка при входе');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg mb-4">
            <Star className="text-white" size={32} fill="white" />
          </div>
          <h1 className="text-2xl mb-2">Вход в систему</h1>
          <p className="text-gray-600">Система рейтинга студентов</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Нет аккаунта?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-blue-600 hover:underline"
            >
              Зарегистрироваться
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
