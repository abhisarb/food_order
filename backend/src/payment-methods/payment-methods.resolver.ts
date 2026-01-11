import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethod } from './dto/payment-method.dto';
import { AddPaymentMethodInput } from './dto/add-payment-method.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Resolver(() => PaymentMethod)
export class PaymentMethodsResolver {
    constructor(private paymentMethodsService: PaymentMethodsService) { }

    @Query(() => [PaymentMethod])
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async myPaymentMethods(@CurrentUser() user: any): Promise<PaymentMethod[]> {
        return this.paymentMethodsService.findByUser(user.userId);
    }

    @Mutation(() => PaymentMethod)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async addPaymentMethod(
        @Args('input') input: AddPaymentMethodInput,
        @CurrentUser() user: any,
    ): Promise<PaymentMethod> {
        return this.paymentMethodsService.create(
            user.userId,
            user.role,
            input.type,
            input.lastFour,
            input.isDefault,
        );
    }

    @Mutation(() => PaymentMethod)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async deletePaymentMethod(
        @Args('id') id: string,
        @CurrentUser() user: any,
    ): Promise<PaymentMethod> {
        return this.paymentMethodsService.delete(id, user.userId, user.role);
    }
}
