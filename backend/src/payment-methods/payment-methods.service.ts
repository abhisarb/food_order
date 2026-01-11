import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentMethodsService {
    constructor(private prisma: PrismaService) { }

    async findByUser(userId: string) {
        return this.prisma.paymentMethod.findMany({
            where: { userId },
        });
    }

    async create(userId: string, role: string, type: string, lastFour: string, isDefault: boolean) {
        if (role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can manage payment methods');
        }

        return this.prisma.paymentMethod.create({
            data: { userId, type, lastFour, isDefault },
        });
    }

    async delete(id: string, userId: string, role: string) {
        if (role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can manage payment methods');
        }

        const paymentMethod = await this.prisma.paymentMethod.findUnique({ where: { id } });

        if (!paymentMethod || paymentMethod.userId !== userId) {
            throw new ForbiddenException('Not your payment method');
        }

        return this.prisma.paymentMethod.delete({ where: { id } });
    }
}
