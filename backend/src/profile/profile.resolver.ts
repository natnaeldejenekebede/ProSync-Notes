import { Resolver, Query, Args, Int } from "@nestjs/graphql";
import { ProfileService } from "./profile.service";
import { UserProfile } from "./profile.schema";

@Resolver(() => UserProfile)
/**
 * Resolver for profile-related functionality
 */
export class ProfileResolver {
  /**
   * Constructor for the ProfileResolver
   *
   * @param profileService The ProfileService instance
   */
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => UserProfile)
  /**
   * Retrieve a user's profile by ID
   */
  async getUserProfileById(
    @Args("userId", { type: () => Int }) userId: number,
  ) {
    return this.profileService.getUserProfileById(userId);
  }

  @Query(() => [UserProfile])
  /**
   * Retrieve a user's profile by username
   */
  async searchProfiles(
    @Args("username", { type: () => String }) username: string,
  ) {
    return this.profileService.getUserProfileByUsername(username);
  }
}
