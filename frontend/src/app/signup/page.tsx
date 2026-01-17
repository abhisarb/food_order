'use client';

import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { SIGNUP_MUTATION, GET_COUNTRIES } from '@/graphql/operations';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User, Globe, ChefHat, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [countryId, setCountryId] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const { data: countriesData, loading: countriesLoading, error: countriesError } = useQuery(GET_COUNTRIES);

    if (countriesError) {
        console.error('Error fetching countries:', countriesError);
    }

    const [signupMutation, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION, {
        onCompleted: (data) => {
            login(data.signup.access_token, data.signup.user);
        },
        onError: (err) => {
            setError(err.message || 'Signup failed');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!countryId) {
            setError('Please select a country');
            return;
        }
        signupMutation({ variables: { email, password, name, countryId } });
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex justify-center mb-4"
                    >
                        <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                            <ChefHat className="h-10 w-10 text-orange-500" />
                        </div>
                    </motion.div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
                    <p className="mt-2 text-sm text-slate-400">Join to share cart with your country!</p>
                </div>

                {countriesError && (
                    <div className="p-3 mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
                        Error loading countries: {countriesError.message}. Make sure backend is running on port 4000.
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 rounded-md">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe className="h-4 w-4 text-slate-500" />
                                </div>
                                <select
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all appearance-none"
                                    value={countryId}
                                    onChange={(e) => setCountryId(e.target.value)}
                                    disabled={countriesLoading}
                                >
                                    <option value="" disabled>Select your country</option>
                                    {countriesData?.countries.map((country: any) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={signupLoading || countriesLoading}
                        className="group relative flex w-full justify-center rounded-lg bg-orange-600 px-3 py-3 text-sm font-semibold text-white hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                    >
                        {signupLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    <div className="text-center text-sm text-slate-500 mt-4">
                        <Link href="/login" className="flex items-center justify-center gap-2 hover:text-orange-400 transition-colors">
                            Already have an account? Sign in <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
