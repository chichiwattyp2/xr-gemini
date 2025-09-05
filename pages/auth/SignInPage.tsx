import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import Button from '../../components/Button';
import { ALL_USER_ROLES } from '../../constants';

export default function SignInPage(){
  // FIX: 'setUserRole' does not exist on the AuthContext. Use 'signIn' instead.
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const quickSignIn = async (r: UserRole) => {
    setIsLoading(true);
    setError('');
    try {
      // For demo purposes, we can use a simpler method
      // that directly sets the role from MOCK_USERS
      // FIX: Use the 'signIn' method provided by the context.
      await signIn({ email: `${r.toLowerCase()}@demo.com`, password: 'password', role: r });
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError('Please enter email and password.');
        return;
    }
    setIsLoading(true);
    setError('');
    try {
      await signIn({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed. Please use a demo role button.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Sign in to VoluSphere</h1>
        <p className="text-gray-400 mb-6 text-center">Use a demo account by picking a role below.</p>

        {error && <div className="text-red-400 text-sm mb-4 bg-red-900/50 p-3 rounded-md">{error}</div>}

        <div className="mb-4">
            <label className="text-sm font-semibold text-gray-300">Quick Sign-in (Demo Roles)</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {ALL_USER_ROLES.filter(r => r !== UserRole.Visitor).map(r => (
                <Button type="button" key={r} onClick={()=>quickSignIn(r as UserRole)}
                        className="w-full focus-ring" variant="secondary" isLoading={isLoading}>
                  Sign in as {r}
                </Button>
              ))}
            </div>
          </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-800 px-2 text-sm text-gray-400">Or with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 sr-only">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
                   className="w-full form-input" placeholder="you@example.com"/>
          </div>
          <div>
            <label className="text-sm text-gray-300 sr-only">Password</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password"
                   className="w-full form-input" placeholder="••••••••"/>
          </div>

          <Button type="submit" className="w-full focus-ring" isLoading={isLoading}>Sign in</Button>
        </form>
      </div>
    </div>
  );
}