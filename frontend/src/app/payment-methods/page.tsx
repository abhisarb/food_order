'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { MY_PAYMENT_METHODS, ADD_PAYMENT_METHOD } from '@/graphql/operations';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, CreditCard, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function PaymentMethodsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState('Credit Card');
    const [lastFour, setLastFour] = useState('');
    const [isDefault, setIsDefault] = useState(true);

    // Protected route: Redirect if not Admin
    if (!authLoading && user?.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const { data, loading, error, refetch } = useQuery(MY_PAYMENT_METHODS);

    const [addPaymentMethod, { loading: adding }] = useMutation(ADD_PAYMENT_METHOD, {
        onCompleted: () => {
            setIsModalOpen(false);
            setLastFour('');
            refetch();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addPaymentMethod({
            variables: { type, lastFour, isDefault },
        });
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            Payment Methods
                            <span className="text-xs bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Admin Only</span>
                        </h1>
                        <p className="mt-2 text-slate-400 font-medium">Manage your secure payment options</p>
                    </motion.div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 rounded-xl text-white font-bold text-sm shadow-[0_0_20px_rgba(234,88,12,0.2)] hover:bg-orange-500 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Method
                    </motion.button>
                </header>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-400 flex items-start gap-4 backdrop-blur-md">
                        <AlertCircle className="h-6 w-6 shrink-0" />
                        <div>
                            <p className="font-bold">Error loading payments</p>
                            <p className="text-sm opacity-80">{error.message}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data?.myPaymentMethods.map((method: any, index: number) => (
                            <motion.div
                                key={method.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative overflow-hidden p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl group hover:border-orange-500/30 transition-all"
                            >
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                                            <CreditCard className="h-6 w-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{method.type}</h3>
                                            <p className="text-slate-500 font-mono tracking-widest">•••• •••• •••• {method.lastFour}</p>
                                        </div>
                                    </div>
                                    {method.isDefault && (
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20 uppercase">
                                            <ShieldCheck className="h-3 w-3" />
                                            Default
                                        </span>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between relative z-10">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Added securely</span>
                                    <button className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Decorative background glow */}
                                <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-orange-600/5 blur-3xl rounded-full" />
                            </motion.div>
                        ))}

                        {data?.myPaymentMethods.length === 0 && (
                            <div className="col-span-full py-20 text-center rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/20">
                                <CreditCard className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No payment methods found.</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-4 text-orange-500 font-bold hover:underline"
                                >
                                    Add your first card
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Add Payment Method</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Card Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                                    >
                                        <option>Credit Card</option>
                                        <option>Debit Card</option>
                                        <option>Prepaid Card</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Last 4 Digits</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={4}
                                        pattern="\d{4}"
                                        placeholder="4242"
                                        value={lastFour}
                                        onChange={(e) => setLastFour(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={isDefault}
                                        onChange={(e) => setIsDefault(e.target.checked)}
                                        className="h-4 w-4 bg-slate-800 border-slate-700 rounded text-orange-500 focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                                    />
                                    <label htmlFor="isDefault" className="text-sm text-slate-300 cursor-pointer">Set as default method</label>
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        disabled={adding}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-orange-600 rounded-xl text-white font-bold hover:bg-orange-500 transition-all disabled:opacity-50"
                                    >
                                        {adding ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Selection'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full py-3 bg-slate-800 rounded-xl text-slate-400 font-bold hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
