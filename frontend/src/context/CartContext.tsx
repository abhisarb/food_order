'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface CartContextType {
    items: CartItem[];
    restaurantId: string | null;
    addToCart: (item: CartItem, restaurantId: string) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    // Persistence
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedRestaurant = localStorage.getItem('cartRestaurantId');
        if (savedCart) setItems(JSON.parse(savedCart));
        if (savedRestaurant) setRestaurantId(savedRestaurant);
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
        if (restaurantId) {
            localStorage.setItem('cartRestaurantId', restaurantId);
        } else {
            localStorage.removeItem('cartRestaurantId');
        }
    }, [items, restaurantId]);

    const addToCart = (item: CartItem, newRestaurantId: string) => {
        // If starting a cart from a different restaurant, clear the old one
        if (restaurantId && restaurantId !== newRestaurantId) {
            if (!confirm('Moving to a new restaurant will clear your current cart. Continue?')) {
                return;
            }
            setItems([{ ...item }]);
            setRestaurantId(newRestaurantId);
            return;
        }

        setRestaurantId(newRestaurantId);
        setItems((prevItems) => {
            const existing = prevItems.find((i) => i.id === item.id);
            if (existing) {
                return prevItems.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prevItems, item];
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems((prevItems) => {
            const updated = prevItems.filter((i) => i.id !== itemId);
            if (updated.length === 0) setRestaurantId(null);
            return updated;
        });
    };

    const clearCart = () => {
        setItems([]);
        setRestaurantId(null);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, restaurantId, addToCart, removeFromCart, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
