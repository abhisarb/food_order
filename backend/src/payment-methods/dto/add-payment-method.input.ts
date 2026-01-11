import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddPaymentMethodInput {
    @Field()
    type: string;

    @Field()
    lastFour: string;

    @Field()
    isDefault: boolean;
}
