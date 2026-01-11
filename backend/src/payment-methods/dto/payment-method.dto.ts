import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethod {
    @Field()
    id: string;

    @Field()
    type: string;

    @Field()
    lastFour: string;

    @Field()
    isDefault: boolean;
}
