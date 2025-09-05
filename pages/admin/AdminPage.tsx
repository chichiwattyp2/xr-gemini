
import React, { useState } from 'react';
import AnalyticsPanel from './panels/AnalyticsPanel';
import PipelinesPanel from './panels/PipelinesPanel';
import UsersPanel from './panels/UsersPanel';
import ModerationPanel from './panels/ModerationPanel';
import { BarChart2, Server, Users, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

type AdminTab = 'analytics' | 'pipelines' | 'users' | 'moderation';

const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'pipelines', label: 'Pipelines', icon: Server },
  { id: 'users', label: 'Users & Orgs', icon: Users },
  { id: 'moderation', label: 'Moderation', icon: Shield },
];

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsPanel />;
      case 'pipelines':
        return <PipelinesPanel />;
      case 'users':
        return <UsersPanel />;
      case 'moderation':
        return <ModerationPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <p className="text-gray-500 dark:text-gray-400">Platform overview and management tools.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 lg:w-1/5">
          <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center space-x-3 px-4 py-2 rounded-md font-medium text-left w-full transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
