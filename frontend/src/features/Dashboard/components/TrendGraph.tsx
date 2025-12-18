import { useState, useEffect } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { type GraphParams, type GraphPoint, dashboardApi } from "@/features/Dashboard/api";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendGraphProps {
    // We fetch data internally based on controls
}

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
                    <div className="bg-surface border border-border p-3 rounded-lg shadow-lg">
                        <p className="text-sm font-medium mb-1">{label}</p>
                        <p className="text-primary font-bold">${payload[0].value.toLocaleString()}</p>
                    </div>
                );
            }
            return null;
        };

        if (type === 'pie') {
            // Aggregated Pie (Sent vs Received needs distinct data actually, but current API returns time series. 
            // For Pie, we might just sum it up? Or user wants breakdown.
            // Requirement: "data of graph (all trnasaction, sent, recevied)"
            // Pie chart of Time Series is weird unless it's "Spending by Day".
            // Let's stick to simple "Spending by Day" slices for now or switch back to line if data is 1 point.
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data as any}
                            dataKey="amount"
                            nameKey="date"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`oklch(from var(--color-primary) l c h / ${1 - index * 0.1})`} />
                            ))}
                        </Pie>
                        <Tooltip content={<CommonTooltip />} />
                        <Legend />
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
                        <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )
        }

        // Default Line (Area)
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} tickMargin={10} />
                    <Tooltip content={<CommonTooltip />} />
                    <Area type="monotone" dataKey="amount" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
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
