'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANTS } from '@/graphql/operations';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Loader2, Utensils, Star, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();
    const { data, loading, error } = useQuery(GET_RESTAURANTS);

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            Welcome, {user?.name}
                        </h1>
                        <p className="mt-2 text-slate-400">Discover the best food in your area</p>
                    </motion.div>
                </header>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                        Error loading restaurants: {error.message}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {data?.restaurants.map((restaurant: any, index: number) => (
                            <motion.div
                                key={restaurant.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-all hover:border-orange-500/50"
                            >
                                <Link href={`/restaurants/${restaurant.id}`}>
                                    <div className="aspect-video w-full overflow-hidden bg-slate-800 relative">
                                        <img
                                            src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'}
                                            alt={restaurant.name}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                                            <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                                            <span className="text-[10px] font-bold text-white">4.8</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-bold text-white">{restaurant.name}</h3>
                                            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                                                <MapPin className="h-3 w-3" />
                                                <span>{restaurant.country.name}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                                            {restaurant.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                            <div className="flex items-center gap-2">
                                                <Utensils className="h-4 w-4 text-orange-500" />
                                                <span className="text-xs text-slate-400">Fast Food • $$$</span>
                                            </div>
                                            <span className="text-xs font-bold text-orange-500 group-hover:underline">View Menu →</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
