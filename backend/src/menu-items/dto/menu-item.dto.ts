import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class MenuItem {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => Float)
    price: number;

    @Field()
    category: string;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field()
    restaurantId: string;
}
