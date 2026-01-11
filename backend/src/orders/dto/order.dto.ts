import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Restaurant } from '../../restaurants/dto/restaurant.dto';
import { MenuItem } from '../../menu-items/dto/menu-item.dto';

@ObjectType()
export class OrderItem {
    @Field()
    id: string;

    @Field()
    menuItemId: string;

    @Field(() => MenuItem, { nullable: true })
    menuItem?: MenuItem;

    @Field()
    quantity: number;

    @Field(() => Float)
    price: number;
}

@ObjectType()
export class Order {
    @Field()
    id: string;

    @Field()
    userId: string;

    @Field()
    restaurantId: string;

    @Field(() => Restaurant, { nullable: true })
    restaurant?: Restaurant;

    @Field()
    status: string;

    @Field(() => Float)
    total: number;

    @Field(() => [OrderItem], { nullable: true })
    items?: OrderItem[];

    @Field()
    createdAt: Date;
}
