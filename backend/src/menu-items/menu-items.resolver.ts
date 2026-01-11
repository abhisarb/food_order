import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from './dto/menu-item.dto';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';

@Resolver(() => MenuItem)
export class MenuItemsResolver {
    constructor(private menuItemsService: MenuItemsService) { }

    @Query(() => [MenuItem])
    @UseGuards(GqlAuthGuard)
    async menuItems(@Args('restaurantId') restaurantId: string): Promise<any> {
        return this.menuItemsService.findByRestaurant(restaurantId);
    }
}
