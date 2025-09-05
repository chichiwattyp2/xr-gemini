import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import Spinner from '../../../components/Spinner';
import Card, { CardContent, CardHeader } from '../../../components/Card';
import { Users, Clock, Percent, Smartphone, Tv } from 'lucide-react';
import { Quality } from '../../../types';

interface AdminStats {
    workersOnline: number;
    queueDepth: number;
    failuresLastHour: number;
    dau: number;
    mau: number;
    avgSessionSec: number;
    completionPct: number;
    deviceBreakdown: { name: string; value: number }[];
    mrUsagePct: number;
    lodDistribution: { name: Quality; value: number }[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <Card>
        <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
                <Icon className="w-8 h-8 text-primary-500" />
                <div>
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const SimpleBarChart: React.FC<{ data: { name: string, value: number }[], title: string }> = ({ data, title }) => (
    <Card>
        <CardHeader><h3 className="font-semibold">{title}</h3></CardHeader>
        <CardContent>
            <div className="space-y-2">
                {data.map(item => (
                    <div key={item.name} className="flex items-center">
                        <span className="w-24 text-sm text-gray-400">{item.name}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-4">
                            <div className="bg-primary-500 h-4 rounded-full" style={{ width: `${item.value}%` }}></div>
                        </div>
                        <span className="w-12 text-right text-sm font-semibold">{item.value}%</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const Analytics: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const data = await api.getAdminStats();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
    }

    if (!stats) {
        return <div>Failed to load analytics data.</div>;
    }

    const mrData = [
        { name: 'MR On', value: stats.mrUsagePct },
        { name: 'MR Off', value: 100 - stats.mrUsagePct }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Daily Active Users" value={stats.dau.toLocaleString()} icon={Users} />
                <StatCard title="Monthly Active Users" value={stats.mau.toLocaleString()} icon={Users} />
                <StatCard title="Avg Session" value={`${(stats.avgSessionSec / 60).toFixed(1)} min`} icon={Clock} />
                <StatCard title="Completion Rate" value={`${stats.completionPct}%`} icon={Percent} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <SimpleBarChart title="Device Breakdown" data={stats.deviceBreakdown} />
                <SimpleBarChart title="MR Usage" data={mrData} />
            </div>
            <SimpleBarChart title="LOD Distribution" data={stats.lodDistribution} />
        </div>
    );
};

export default Analytics;