import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthResponse } from "./auth.schema";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args("username") username: string,
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    await this.authService.register(username, email, password);
    return { message: "User registered successfully" };
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    const token = await this.authService.login(email, password);
    return { message: "Login successful", accessToken: token.access_token };
  }
}
