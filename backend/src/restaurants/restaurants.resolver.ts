import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './dto/restaurant.dto';
import { Country } from '../auth/dto/auth-response.dto';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
    constructor(private restaurantsService: RestaurantsService) { }

    @Query(() => [Country])
    async countries(): Promise<any> {
        return this.restaurantsService.findAllCountries();
    }

    @Query(() => [Restaurant])
    @UseGuards(GqlAuthGuard)
    async restaurants(@CurrentUser() user: any): Promise<any> {
        return this.restaurantsService.findAll(user.countryId);
    }

    @Query(() => Restaurant, { nullable: true })
    @UseGuards(GqlAuthGuard)
    async restaurant(
        @Args('id') id: string,
        @CurrentUser() user: any,
    ): Promise<any> {
        const restaurant = await this.restaurantsService.findOne(id);
        if (restaurant && restaurant.countryId !== user.countryId) {
            throw new Error('Access denied: Restaurant not in your country');
        }
        return restaurant;
    }
}
