import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
  imports: [SupabaseModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
/**
 * Module for handling profile-related functionality
 */
export class ProfileModule {}
