import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, User } from './dto/auth-response.dto';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => AuthResponse)
    async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
        return this.authService.login(input.email, input.password);
    }

    @Mutation(() => AuthResponse)
    async signup(@Args('input') input: SignupInput): Promise<AuthResponse> {
        return this.authService.signup(
            input.email,
            input.password,
            input.name,
            input.role,
            input.countryId,
        );
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    async me(@CurrentUser() user: any): Promise<User> {
        return user;
    }
}
