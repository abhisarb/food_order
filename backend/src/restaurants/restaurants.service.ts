import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
    constructor(private prisma: PrismaService) { }

    async findAll(countryId: string) {
        return this.prisma.restaurant.findMany({
            where: { countryId },
            include: { country: true },
        });
    }

    async findOne(id: string) {
        return this.prisma.restaurant.findUnique({
            where: { id },
            include: { country: true, menuItems: true },
        });
    }
}
