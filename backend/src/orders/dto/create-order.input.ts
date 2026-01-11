import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class OrderItemInput {
    @Field()
    menuItemId: string;

    @Field()
    quantity: number;
}

@InputType()
export class CreateOrderInput {
    @Field()
    restaurantId: string;

    @Field(() => [OrderItemInput])
    items: OrderItemInput[];
}
