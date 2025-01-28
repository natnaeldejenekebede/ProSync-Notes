import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { SupabaseModule } from "../supabase/supabase.module";
import { ProfileResolver } from "./profile.resolver";

@Module({
  imports: [SupabaseModule],
  providers: [ProfileService, ProfileResolver],
  controllers: [ProfileController],
})
/**
 * Module for handling profile-related functionality
 */
export class ProfileModule {}
