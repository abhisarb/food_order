import { ObjectType, Field } from '@nestjs/graphql';
import { Country } from '../../auth/dto/auth-response.dto';

@ObjectType()
export class Restaurant {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field()
    countryId: string;

    @Field(() => Country, { nullable: true })
    country?: Country;
}
