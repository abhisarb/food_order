'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '@/graphql/operations';
import { useRouter } from 'next/navigation';

export default function SideCart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { items, total, removeFromCart, clearCart, restaurantId, addToCart } = useCart();
    const router = useRouter();

    const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER, {
        onCompleted: (data) => {
            clearCart();
            onClose();
            router.push(`/orders/${data.createOrder.id}/success`);
        },
        onError: (err) => {
            alert(err.message);
        },
    });

    const handleCheckout = () => {
        if (!restaurantId || items.length === 0) return;

        const inputItems = items.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity
        }));

        createOrder({
            variables: {
                restaurantId,
                items: inputItems
            }
        });
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500/10 rounded-lg">
                                        <ShoppingBag className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Your Cart</h2>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                                {items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                        <div className="p-6 bg-slate-900 rounded-full border border-slate-800">
                                            <ShoppingCart className="h-12 w-12 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-lg">Empty Cart</p>
                                            <p className="text-sm text-slate-400">Add some delicious items to start!</p>
                                        </div>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <motion.div
                                            layout
                                            key={item.id}
                                            className="flex items-center gap-4 group"
                                        >
                                            <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                                                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-white text-sm uppercase tracking-tight line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-orange-500 font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</p>

                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                                                        <button
                                                            onClick={() => item.quantity > 1 ? addToCart({ ...item, quantity: -1 }, restaurantId!) : removeFromCart(item.id)}
                                                            className="text-slate-400 hover:text-white p-1"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="text-xs font-bold text-white w-6 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => addToCart({ ...item, quantity: 1 }, restaurantId!)}
                                                            className="text-slate-400 hover:text-white p-1"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="p-6 border-t border-slate-800 bg-slate-900/40 space-y-4">
                                    <div className="flex items-center justify-between text-slate-400 text-sm">
                                        <span>Subtotal</span>
                                        <span className="text-white font-bold">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-400 text-sm">
                                        <span>Delivery Fee</span>
                                        <span className="text-emerald-500 font-bold uppercase text-[10px]">Free</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                        <span className="text-lg font-extrabold text-white">Total</span>
                                        <span className="text-lg font-extrabold text-white">${total.toFixed(2)}</span>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={creating}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold rounded-2xl transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] disabled:opacity-50 mt-4 group"
                                    >
                                        {creating ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <>
                                                Confirm and Order
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
