import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignupInput {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    name: string;

    @Field()
    role: string;

    @Field()
    countryId: string;
}
