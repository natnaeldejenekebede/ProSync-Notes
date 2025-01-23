import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@ApiTags("Authentication") // Group these endpoints under "Authentication"
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" }) // Summary for the endpoint
  @ApiResponse({ status: 201, description: "User successfully registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiBody({
    description: "User registration data",
    schema: {
      type: "object",
      properties: {
        username: { type: "string", description: "The username of the user" },
        email: { type: "string", description: "The email of the user" },
        password: { type: "string", description: "The password of the user" },
      },
    },
  })
  register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    return this.authService.register(body.username, body.email, body.password);
  }

  @Post("login")
  @ApiOperation({ summary: "Login an existing user" })
  @ApiResponse({ status: 200, description: "User successfully logged in" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @ApiBody({
    description: "User login data",
    schema: {
      type: "object",
      properties: {
        email: { type: "string", description: "The email of the user" },
        password: { type: "string", description: "The password of the user" },
      },
    },
  })
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post("check-email-exists")
  @ApiOperation({ summary: "Check if an email exists" })
  @ApiResponse({ status: 200, description: "Email check completed" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiBody({
    description: "Email to check",
    schema: {
      type: "object",
      properties: {
        email: { type: "string", description: "The email to check" },
      },
    },
  })
  checkEmail(@Body() body: { email: string }) {
    return this.authService.checkEmailExists(body.email);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset a user's password" })
  @ApiResponse({ status: 200, description: "Password successfully reset" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiBody({
    description: "Password reset data",
    schema: {
      type: "object",
      properties: {
        email: { type: "string", description: "The email of the user" },
        newPassword: { type: "string", description: "The new password" },
        confirmPassword: {
          type: "string",
          description: "Confirmation of the new password",
        },
      },
    },
  })
  resetPassword(
    @Body()
    body: {
      email: string;
      newPassword: string;
      confirmPassword: string;
    },
  ) {
    return this.authService.resetPassword(
      body.email,
      body.newPassword,
      body.confirmPassword,
    );
  }
}
