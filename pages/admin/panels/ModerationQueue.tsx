import React from 'react';
import Card, { CardContent, CardHeader } from '../../../components/Card';
import Button from '../../../components/Button';
import { Check, X, Eye } from 'lucide-react';

const flaggedContent = [
    { id: 'exp_789', title: 'Urban Explorer', reason: 'Inappropriate Content', flaggedBy: 'user_viewer', date: '2023-12-10' },
    { id: 'exp_456', title: 'Forest Meditation', reason: 'Copyright Claim', flaggedBy: 'user_admin', date: '2023-12-11' },
];

const ModerationQueue: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <h3 className="font-semibold">Moderation Queue</h3>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="p-4 font-semibold">Content</th>
                                <th className="p-4 font-semibold">Reason</th>
                                <th className="p-4 font-semibold">Flagged By</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flaggedContent.map(item => (
                                <tr key={item.id} className="border-b border-gray-700 last:border-b-0">
                                    <td className="p-4 font-medium">{item.title} ({item.id})</td>
                                    <td className="p-4">{item.reason}</td>
                                    <td className="p-4 font-mono text-xs">{item.flaggedBy}</td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4 space-x-2">
                                        <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1"/>Review</Button>
                                        <Button size="sm" variant="secondary" className="bg-green-500 hover:bg-green-600 text-white"><Check className="w-4 h-4 mr-1"/>Approve</Button>
                                        <Button size="sm" variant="destructive"><X className="w-4 h-4 mr-1"/>Takedown</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {flaggedContent.length === 0 && (
                        <p className="p-8 text-center text-gray-500">The moderation queue is empty.</p>
                     )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ModerationQueue;