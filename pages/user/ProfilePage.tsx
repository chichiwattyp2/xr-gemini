import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import Card, { CardContent, CardHeader } from '../../components/Card';

export default function ProfilePage(){
  const { user, updateProfile, isCreator, isAdmin } = useAuth();
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateProfile({ name, avatarUrl });
    setIsLoading(false);
    setMessage('Profile saved successfully!');
    setTimeout(()=>setMessage(''), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
       <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-400">Manage your account settings.</p>
        </CardHeader>
        <CardContent>
            <form onSubmit={onSave} className="space-y-6">
              <div className="flex items-center gap-4">
                <img src={avatarUrl} alt={name} className="w-24 h-24 rounded-full object-cover"/>
                <div className="flex-1">
                  <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1">Avatar URL</label>
                  <input id="avatarUrl" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)}
                         className="w-full form-input" />
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Display Name</label>
                <input id="name" value={name} onChange={e=>setName(e.target.value)}
                       className="w-full form-input" />
              </div>
               <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <p className="text-lg font-semibold text-primary-400">{user.role}</p>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                <Button type="submit" isLoading={isLoading} className="focus-ring">Save Changes</Button>
                {message && <span className="text-green-400 text-sm">{message}</span>}
              </div>
            </form>
        </CardContent>
       </Card>
    </div>
  );
}