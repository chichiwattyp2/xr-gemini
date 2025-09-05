
import React from 'react';
import Card, { CardContent, CardHeader } from '../../../components/Card';
import { MOCK_USERS } from '../../../data/mockData';
import { UserRole } from '../../../types';
import Button from '../../../components/Button';

const UsersPanel: React.FC = () => {
    const users = Object.values(MOCK_USERS).filter(u => u.role !== UserRole.Visitor);
    return (
        <Card>
            <CardHeader>
                <h3 className="font-semibold">Users & Organizations</h3>
            </CardHeader>
            <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Org ID</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b dark:border-gray-700 last:border-b-0">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">{user.role}</td>
                                    <td className="p-4 font-mono text-xs">{user.orgId || 'N/A'}</td>
                                    <td className="p-4 space-x-2">
                                        <Button size="sm" variant="outline">Edit</Button>
                                        <Button size="sm" variant="destructive">Suspend</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default UsersPanel;
