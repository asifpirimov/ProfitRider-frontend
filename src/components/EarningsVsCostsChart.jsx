import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const EarningsVsCostsChart = ({ data }) => {
    const chartData = data && data.length > 0 ? data : [
        { name: 'Mon', earnings: 0, costs: 0 },
        { name: 'Tue', earnings: 0, costs: 0 },
        { name: 'Wed', earnings: 0, costs: 0 },
        { name: 'Thu', earnings: 0, costs: 0 },
        { name: 'Fri', earnings: 0, costs: 0 },
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="earnings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Earnings" />
                    <Bar dataKey="costs" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} name="Costs" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EarningsVsCostsChart;
