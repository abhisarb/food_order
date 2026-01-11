'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MENU_ITEMS } from '@/graphql/operations';
import Navbar from '@/components/Navbar';
import SideCart from '@/components/SideCart';
import { motion } from 'framer-motion';
import { Loader2, Plus, ArrowLeft, ShoppingCart, Percent } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function RestaurantMenuPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart, itemCount } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { data, loading, error } = useQuery(GET_MENU_ITEMS, {
        variables: { restaurantId: id },
    });

    const restaurantName = data?.menuItems[0]?.restaurant?.name || 'Restaurant';

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <header className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
                    >
                        <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-slate-800 border border-slate-800/50">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Back to Restaurants</span>
                    </button>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-3 bg-orange-600 rounded-2xl hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] group"
                    >
                        <ShoppingCart className="h-5 w-5 text-white" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-orange-600 shadow-lg border-2 border-orange-600 animate-in zoom-in duration-300">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </header>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="relative">
                            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                            <div className="absolute inset-0 blur-xl bg-orange-500/20 animate-pulse" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-900/10 p-6 text-red-400 backdrop-blur-md">
                        <p className="font-bold flex items-center gap-2">
                            <Plus className="rotate-45 h-5 w-5" />
                            Failed to load menu
                        </p>
                        <p className="text-sm opacity-80 mt-1">{error.message}</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <section>
                            <div className="flex items-end justify-between mb-8 border-b border-slate-800 pb-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Signature Menu</h2>
                                    <p className="text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-[0.2em]">Curated by top chefs</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                    <Percent className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-500 uppercase">20% Off your first order</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {data?.menuItems.map((item: any, index: number) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-3xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-orange-500/30 transition-all group relative overflow-hidden"
                                    >
                                        <div className="h-32 w-full sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-800 border border-slate-700/50">
                                            <img
                                                src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                                                alt={item.name}
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="flex-grow w-full">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-extrabold text-white uppercase tracking-tight line-clamp-1">{item.name}</h3>
                                                <span className="text-orange-500 font-black text-lg">${item.price.toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 text-[9px] font-bold uppercase">{item.category}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        addToCart({
                                                            id: item.id,
                                                            name: item.name,
                                                            price: item.price,
                                                            imageUrl: item.imageUrl,
                                                            quantity: 1
                                                        }, id as string);
                                                        setIsCartOpen(true);
                                                    }}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600/10 text-orange-500 hover:bg-orange-600 hover:text-white text-xs font-black transition-all uppercase tracking-tight border border-orange-600/20"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtle aesthetic gradient */}
                                        <div className="absolute top-0 right-0 h-32 w-32 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>

            <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}
