import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthResponse } from "./auth.schema";

@Resolver()
/**
 * The resolver for the authentication module - built for GraphQL
 */
export class AuthResolver {
  /**
   * Constructor for the AuthResolver
   *
   * @param authService The AuthService instance
   */
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  /**
   * Registers a new user
   */
  async register(
    @Args("username") username: string,
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    await this.authService.register(username, email, password);
    return { message: "User registered successfully" };
  }

  @Mutation(() => AuthResponse)
  /**
   * Logs in an existing user
   */
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    const token = await this.authService.login(email, password);
    return { message: "Login successful", accessToken: token.access_token };
  }
}
