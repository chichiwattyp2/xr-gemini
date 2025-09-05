
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { api } from '../../../services/api';
import { AnalyticsData } from '../../../types';
import Spinner from '../../../components/Spinner';
import Card, { CardContent, CardHeader } from '../../../components/Card';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AnalyticsPanel: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const analyticsData = await api.getAnalyticsData();
      setData(analyticsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
  }

  if (!data) {
    return <div>Failed to load analytics data.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><h3 className="font-semibold">Daily Active Users (DAU) - Last 30 Days</h3></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dau}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                  borderColor: 'rgba(75, 85, 99, 1)', // border-gray-600
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
          <Card>
             <CardHeader><h3 className="font-semibold">Device Breakdown</h3></CardHeader>
             <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={data.deviceBreakdown} dataKey="value" nameKey="device" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                             {data.deviceBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(75, 85, 99, 1)' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
             </CardContent>
          </Card>
           <Card>
             <CardHeader><h3 className="font-semibold">MR Usage</h3></CardHeader>
             <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={data.mrUsage} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" paddingAngle={5} label>
                            <Cell fill="#3b82f6" />
                            <Cell fill="#6b7280" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(75, 85, 99, 1)' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
             </CardContent>
          </Card>
      </div>

    </div>
  );
};

export default AnalyticsPanel;
