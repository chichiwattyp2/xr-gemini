import React, { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader } from '../../../components/Card';
import { api } from '../../../services/api';
import { User, Organization } from '../../../types';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import { PlusCircle } from 'lucide-react';

const UsersOrgs: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [userData, orgData] = await Promise.all([
                api.getUsers(),
                api.getOrganizations()
            ]);
            setUsers(userData.filter(u => u.role !== 'Visitor'));
            setOrgs(orgData);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
    }

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
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Plan</th>
                                    <th className="p-4 font-semibold">Seats</th>
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orgs.map(org => (
                                    <tr key={org.id} className="border-b border-gray-700 last:border-b-0">
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
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="p-4 font-semibold">User</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold">Organization</th>
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-700 last:border-b-0">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">{user.role}</td>
                                        <td className="p-4">{orgs.find(o => o.id === user.orgId)?.name || 'N/A'}</td>
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

export default UsersOrgs;