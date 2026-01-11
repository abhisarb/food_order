'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useParams } from 'next/navigation';

export default function OrderSuccessPage() {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="flex flex-col items-center justify-center px-4 pt-20 pb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg text-center"
                >
                    <div className="relative inline-block mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="p-6 bg-emerald-500 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                        >
                            <CheckCircle2 className="h-16 w-16 text-white" />
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full border-4 border-emerald-500/20"
                        />
                    </div>

                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Order Received!</h1>
                    <p className="text-slate-400 text-lg mb-2 font-medium">Your delicious meal is being prepared.</p>
                    <div className="inline-block px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                        <p className="text-xs font-mono text-slate-500">Order ID: <span className="text-orange-500 font-bold uppercase">{id}</span></p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/orders"
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-800 transition-all group"
                        >
                            <ShoppingBag className="h-5 w-5 text-slate-400 group-hover:text-white" />
                            Track Order
                        </Link>
                        <Link
                            href="/dashboard"
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(234,88,12,0.2)] group"
                        >
                            Back to Home
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="mt-16 p-8 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-500/10 rounded-xl">
                                <Package className="h-6 w-6 text-orange-500" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white uppercase text-xs tracking-widest">Next Step</h3>
                                <p className="text-sm text-slate-400">Our chef is starting your order now</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <div className={`h-1.5 grow rounded-full ${i === 1 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-slate-800'}`} />
                                </div>
                            ))}
                        </div>

                        {/* Decorative glow */}
                        <div className="absolute -left-10 -bottom-10 h-32 w-32 bg-orange-500/5 blur-[60px] rounded-full" />
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
