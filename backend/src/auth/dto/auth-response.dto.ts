import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Country {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    code: string;
}

@ObjectType()
export class User {
    @Field()
    id: string;

    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    role: string;

    @Field(() => Country)
    country: Country;
}

@ObjectType()
export class AuthResponse {
    @Field()
    access_token: string;

    @Field(() => User)
    user: User;
}
