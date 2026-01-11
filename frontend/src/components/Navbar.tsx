'use client';

import { useAuth } from '@/context/AuthContext';
import { ChefHat, ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'My Orders', path: '/orders' },
    ];

    if (user.role === 'ADMIN') {
        navItems.push({ name: 'Payments', path: '/payment-methods' });
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <ChefHat className="h-8 w-8 text-orange-500" />
                            <span className="text-xl font-bold text-white tracking-tight">FO<span className="text-orange-500">App</span></span>
                        </Link>
                        <div className="ml-10 hidden space-x-8 md:flex">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`${pathname === item.path
                                        ? 'text-orange-500 font-semibold'
                                        : 'text-slate-400 hover:text-white transition-colors'
                                        } text-sm`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2 text-right">
                            <span className="text-sm font-black text-white leading-none uppercase tracking-tight">{user.name}</span>
                            <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest flex items-center gap-2">
                                <span className="text-orange-500/80">{user.role}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-800" />
                                {user.country.name}
                            </span>
                        </div>
                        <div className="h-10 w-10 border border-slate-800 bg-slate-900/50 rounded-2xl flex items-center justify-center group-hover:border-orange-500/50 transition-all">
                            <UserIcon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                        <button
                            onClick={logout}
                            className="p-3 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 transition-all group/logout"
                        >
                            <LogOut className="h-5 w-5 text-slate-500 group-hover/logout:text-red-400 transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
