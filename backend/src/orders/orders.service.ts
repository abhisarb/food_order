import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateOrderInput {
    restaurantId: string;
    items: { menuItemId: string; quantity: number }[];
}

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, countryId: string, input: CreateOrderInput) {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: input.restaurantId },
        });

        if (!restaurant || restaurant.countryId !== countryId) {
            throw new ForbiddenException('Cannot order from restaurants in other countries');
        }

        const menuItems = await this.prisma.menuItem.findMany({
            where: { id: { in: input.items.map((i) => i.menuItemId) } },
        });

        const total = input.items.reduce((sum, item) => {
            const menuItem = menuItems.find((mi) => mi.id === item.menuItemId)!;
            return sum + menuItem.price * item.quantity;
        }, 0);

        return this.prisma.order.create({
            data: {
                userId,
                restaurantId: input.restaurantId,
                status: 'PENDING',
                total,
                items: {
                    create: input.items.map((item) => {
                        const menuItem = menuItems.find((mi) => mi.id === item.menuItemId)!;
                        return {
                            menuItemId: item.menuItemId,
                            quantity: item.quantity,
                            price: menuItem.price,
                        };
                    }),
                },
            },
            include: { items: { include: { menuItem: true } }, restaurant: true },
        });
    }

    async findByUser(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { menuItem: true } }, restaurant: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async checkout(orderId: string, userId: string, role: string) {
        if (role === 'MEMBER') {
            throw new ForbiddenException('Members cannot checkout orders');
        }

        const order = await this.prisma.order.findUnique({ where: { id: orderId } });

        if (!order || order.userId !== userId) {
            throw new ForbiddenException('Not your order');
        }

        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID', paidAt: new Date() },
            include: { items: { include: { menuItem: true } }, restaurant: true },
        });
    }

    async cancel(orderId: string, userId: string, role: string) {
        if (role === 'MEMBER') {
            throw new ForbiddenException('Members cannot cancel orders');
        }

        const order = await this.prisma.order.findUnique({ where: { id: orderId } });

        if (!order || order.userId !== userId) {
            throw new ForbiddenException('Not your order');
        }

        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
            include: { items: { include: { menuItem: true } }, restaurant: true },
        });
    }
}
