
import React from 'react';
import Card, { CardContent, CardHeader } from '../../../components/Card';
import { MOCK_USERS, MOCK_ORGS } from '../../../data/mockData';
import { UserRole } from '../../../types';
import Button from '../../../components/Button';
import { PlusCircle } from 'lucide-react';

const UsersPanel: React.FC = () => {
    const users = Object.values(MOCK_USERS).filter(u => u.role !== UserRole.Visitor);
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h3 className="font-semibold">Organizations</h3>
                    <Button variant="outline" size="sm"><PlusCircle className="w-4 h-4 mr-2" />Add Organization</Button>
                </CardHeader>
                 <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-4 font-semibold">Organization Name</th>
                                    <th className="p-4 font-semibold">Plan</th>
                                    <th className="p-4 font-semibold">Seats</th>
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_ORGS.map(org => (
                                    <tr key={org.id} className="border-b dark:border-gray-700 last:border-b-0">
                                        <td className="p-4 font-medium">{org.name}</td>
                                        <td className="p-4">{org.plan}</td>
                                        <td className="p-4">{org.seatsUsed} / {org.seats}</td>
                                        <td className="p-4"><Button size="sm" variant="outline">Manage</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h3 className="font-semibold">Users</h3>
                     <Button variant="outline" size="sm"><PlusCircle className="w-4 h-4 mr-2" />Invite User</Button>
                </CardHeader>
                <CardContent className="p-0">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-4 font-semibold">User</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold">Organization</th>
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
                                        <td className="p-4">{MOCK_ORGS.find(o => o.id === user.orgId)?.name || 'N/A'}</td>
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
        </div>
    );
};

export default UsersPanel;