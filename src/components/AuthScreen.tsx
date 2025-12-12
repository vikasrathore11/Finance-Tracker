import { useState } from 'react';
import { Mail, Lock, TrendingUp, PieChart, Target, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AuthScreenProps {
  onLogin: (email: string) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Store user data in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!isLogin) {
        users.push({ email, name, password });
        localStorage.setItem('users', JSON.stringify(users));
      }
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Branding & Features */}
          <div className="order-2 lg:order-1 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FinanceFlow
                </h1>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Take control of your finances
              </h2>
              <p className="text-xl text-gray-600">
                Track expenses, analyze spending patterns, and achieve your financial goals with ease.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <FeatureCard
                icon={<PieChart className="w-6 h-6" />}
                title="Smart Analytics"
                description="Visualize spending with interactive charts"
              />
              <FeatureCard
                icon={<Target className="w-6 h-6" />}
                title="Budget Goals"
                description="Set and track monthly budget limits"
              />
              <FeatureCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Expense Tracking"
                description="Categorize and monitor daily expenses"
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Secure & Private"
                description="Your financial data stays safe"
              />
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h3>
                <p className="text-gray-600">
                  {isLogin
                    ? 'Enter your credentials to access your account'
                    : 'Sign up to start tracking your finances'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                )}

                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  required
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                  required
                />

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <button type="button" className="text-indigo-600 hover:text-indigo-700">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button type="submit" variant="primary" fullWidth>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
