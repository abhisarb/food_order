import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './dto/order.dto';
import { CreateOrderInput } from './dto/create-order.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => Order)
export class OrdersResolver {
    constructor(private ordersService: OrdersService) { }

    @Mutation(() => Order)
    @UseGuards(GqlAuthGuard)
    async createOrder(
        @Args('input') input: CreateOrderInput,
        @CurrentUser() user: any,
    ): Promise<any> {
        return this.ordersService.create(user.userId, user.countryId, input);
    }

    @Query(() => [Order])
    @UseGuards(GqlAuthGuard)
    async myOrders(@CurrentUser() user: any): Promise<any> {
        return this.ordersService.findByUser(user.userId);
    }

    @Mutation(() => Order)
    @UseGuards(GqlAuthGuard)
    async checkoutOrder(
        @Args('orderId') orderId: string,
        @CurrentUser() user: any,
    ): Promise<any> {
        return this.ordersService.checkout(orderId, user.userId, user.role);
    }

    @Mutation(() => Order)
    @UseGuards(GqlAuthGuard)
    async cancelOrder(
        @Args('orderId') orderId: string,
        @CurrentUser() user: any,
    ): Promise<any> {
        return this.ordersService.cancel(orderId, user.userId, user.role);
    }
}
