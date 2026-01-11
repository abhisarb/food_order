import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuItemsService {
    constructor(private prisma: PrismaService) { }

    async findByRestaurant(restaurantId: string) {
        return this.prisma.menuItem.findMany({
            where: { restaurantId },
            include: { restaurant: true },
        });
    }
}
