import { useState, useEffect } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { type GraphParams, type GraphPoint, dashboardApi } from "@/features/Dashboard/api";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrendGraph() {
    const [data, setData] = useState<GraphPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Controls
    const [filter, setFilter] = useState<GraphParams['filter']>('all');
    const [range, setRange] = useState<GraphParams['range']>('7d');
    const [type, setType] = useState<'line' | 'bar' | 'pie'>('line');

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await dashboardApi.getGraphData({ filter, range });
                if (isMounted) setData(res);
            } catch (error) {
                console.error("Failed to fetch graph data", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [filter, range]);

    // Graph Type Renderer
    const renderChart = () => {
        if (isLoading) {
            return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
        }

        if (data.length === 0) {
            return <div className="h-full flex items-center justify-center text-text-muted">No data for this period</div>;
        }

        const CommonTooltip = ({ active, payload, label }: any) => {
            if (active && payload && payload.length) {
                return (
                    <div className="bg-surface border border-border p-3 rounded-lg shadow-lg min-w-[150px]">
                        <p className="text-sm font-medium mb-2 text-text-muted">{label}</p>
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex justify-between items-center gap-4 mb-1">
                                <span className="text-xs font-semibold capitalize" style={{ color: entry.stroke }}>{entry.name}:</span>
                                <span className="font-bold text-text">${entry.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                );
            }
            return null;
        };

        if (type === 'pie') {
            const totalSent = data.reduce((acc, curr) => acc + curr.sent, 0);
            const totalReceived = data.reduce((acc, curr) => acc + curr.received, 0);
            const pieData = [
                { name: 'Received', value: totalReceived, color: '#16A34A' },
                { name: 'Sent', value: totalSent, color: '#EF4444' }
            ];

            return (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            )
        }

        if (type === 'bar') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} tickMargin={10} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} tickMargin={10} />
                        <Tooltip content={<CommonTooltip />} cursor={{ fill: 'var(--color-surface-muted)' }} />
                        {/* Unstacked Bars side-by-side for comparison */}
                        <Bar dataKey="received" name="Received" fill="#16A34A" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="sent" name="Sent" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )
        }

        // Default Line (Area)
        // Need to calculate Total for the chart rendering
        const chartData = data.map(point => ({
            ...point,
            total: point.sent + point.received
        }));

        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} /> {/* Blue-500 */}
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} /> {/* Red-500 */}
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} /> {/* Green-600 */}
                            <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} tickMargin={10} />
                    <Tooltip content={<CommonTooltip />} />

                    {/* Total (Blue) - Render first so it's behind others */}
                    <Area
                        type="monotone"
                        dataKey="total"
                        name="Total"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        strokeWidth={2}
                    />

                    {/* Received (Green) */}
                    <Area
                        type="monotone"
                        dataKey="received"
                        name="Received"
                        stroke="#16A34A"
                        fillOpacity={1}
                        fill="url(#colorReceived)"
                        strokeWidth={2}
                    />

                    {/* Sent (Red) */}
                    <Area
                        type="monotone"
                        dataKey="sent"
                        name="Sent"
                        stroke="#EF4444"
                        fillOpacity={1}
                        fill="url(#colorSent)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 className="font-semibold text-lg">Transaction Trends</h3>

                {/* Controls */}
                <div className="flex flex-wrap gap-2">
                    {/* Range Toggle */}
                    <div className="flex bg-surface-muted rounded-lg p-1">
                        {(['7d', '30d', '90d', '1y'] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                                    range === r ? "bg-surface shadow text-primary" : "text-text-muted hover:text-text"
                                )}
                            >
                                {r.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Filter Select */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="bg-surface-muted border-none text-xs rounded-lg px-3 py-1 focus:ring-0 cursor-pointer"
                    >
                        <option value="all">All Transactions</option>
                        <option value="sent">Sent Only</option>
                        <option value="received">Received Only</option>
                        <option value="owned">My Requests</option>
                        <option value="not_owned">Others' Requests</option>
                    </select>

                    {/* Type Toggle */}
                    <div className="flex bg-surface-muted rounded-lg p-1">
                        {(['line', 'bar', 'pie'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize",
                                    type === t ? "bg-surface shadow text-primary" : "text-text-muted hover:text-text"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[300px]">
                {renderChart()}
            </div>
        </div>
    );
}
