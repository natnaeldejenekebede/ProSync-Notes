import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticatedRequest } from "../types/authenticated-request";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("Profile")
@ApiBearerAuth()
@Controller("profile")
/**
 * Controller for handling profile-related endpoints
 */
export class ProfileController {
  /**
   * Constructor for the ProfileController
   *
   * @param profileService The ProfileService instance
   */
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  @ApiOperation({ summary: "Retrieve the authenticated user's profile" })
  @ApiResponse({ status: 200, description: "Profile retrieved successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  /**
   * Retrieve the profile of the authenticated user
   */
  async getMyProfile(@Request() req: AuthenticatedRequest) {
    return this.profileService.getUserProfileById(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("userId/:id")
  @ApiOperation({ summary: "Retrieve a user profile by ID" })
  @ApiResponse({ status: 200, description: "Profile retrieved successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiParam({
    name: "id",
    description: "ID of the user whose profile is to be retrieved",
  })
  /**
   * Retrieve a user profile by ID
   */
  async getProfileById(@Param("id") id: string) {
    return this.profileService.getUserProfileById(+id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("search")
  @ApiOperation({ summary: "Search for a user profile by username" })
  @ApiResponse({
    status: 200,
    description: "Search results returned successfully",
  })
  @ApiQuery({
    name: "username",
    required: false,
    description: "Username to search for",
  })
  /**
   * Search for a user profile by username
   */
  async searchProfile(@Query("username") username: string) {
    if (!username) return [];

    return this.profileService.getUserProfileByUsername(username);
  }
}
