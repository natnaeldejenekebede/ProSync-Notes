import { Resolver, Query, Args, Int } from "@nestjs/graphql";
import { ProfileService } from "./profile.service";
import { UserProfile } from "./profile.schema";

@Resolver(() => UserProfile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => UserProfile)
  async getUserProfileById(
    @Args("userId", { type: () => Int }) userId: number,
  ) {
    return this.profileService.getUserProfileById(userId);
  }

  @Query(() => [UserProfile])
  async searchProfiles(
    @Args("username", { type: () => String }) username: string,
  ) {
    return this.profileService.getUserProfileByUsername(username);
  }
}
