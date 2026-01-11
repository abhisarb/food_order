'use client';

import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { MY_ORDERS, CANCEL_ORDER } from '@/graphql/operations';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Loader2, Package, Clock, Hash, CheckCircle, XCircle, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function OrderHistoryPage() {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useQuery(MY_ORDERS);

    const [cancelOrder, { loading: cancelling }] = useMutation(CANCEL_ORDER, {
        onCompleted: () => refetch(),
        onError: (err) => alert(err.message),
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'PAID': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="h-3 w-3" />;
            case 'PAID': return <CheckCircle className="h-3 w-3" />;
            case 'CANCELLED': return <XCircle className="h-3 w-3" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-black text-white tracking-tight">Your Orders</h1>
                        <p className="mt-2 text-slate-400 font-medium">Track and manage your delicious journey</p>
                    </motion.div>
                </header>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-400 backdrop-blur-md">
                        <p className="font-bold uppercase tracking-widest text-xs mb-1">Retrieval Error</p>
                        <p className="text-sm opacity-80">{error.message}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {data?.myOrders.map((order: any, index: number) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group p-6 rounded-3xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-all hover:border-orange-500/30 overflow-hidden relative"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform">
                                            <Package className="h-6 w-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order</span>
                                                <span className="font-mono text-[10px] text-orange-500 font-bold bg-orange-500/5 px-1.5 py-0.5 rounded leading-none uppercase">#{order.id.slice(-8)}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{order.restaurant.name}</h3>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </div>
                                                <span className="text-xs text-slate-500 font-medium">{new Date(parseInt(order.createdAt)).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-grow max-w-md">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Items Ordered</div>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item: any, idx: number) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 font-medium whitespace-nowrap">
                                                    {item.quantity}x {item.menuItem.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between lg:justify-end gap-12 lg:min-w-[200px]">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Amount</p>
                                            <p className="text-2xl font-black text-white">${order.total.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && order.status === 'PENDING' && (
                                                <button
                                                    onClick={() => cancelOrder({ variables: { orderId: order.id } })}
                                                    disabled={cancelling}
                                                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-400 transition-colors uppercase"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            <Link href={`/orders/${order.id}/success`} className="p-3 bg-slate-800 rounded-xl hover:bg-orange-600 group/btn transition-all border border-slate-700">
                                                <ChevronRight className="h-5 w-5 text-slate-400 group-hover/btn:text-white transition-colors" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative glow */}
                                <div className="absolute top-0 right-0 h-40 w-40 bg-orange-600/5 blur-[100px] rounded-full" />
                            </motion.div>
                        ))}

                        {data?.myOrders.length === 0 && (
                            <div className="py-24 text-center rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/10">
                                <div className="p-6 bg-slate-900/50 rounded-full inline-block border border-slate-800 mb-6 group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="h-12 w-12 text-slate-700" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-8">Ready to satisfy your cravings? Explore our top restaurants!</p>
                                <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl transition-all shadow-xl">
                                    Order Food Now
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
