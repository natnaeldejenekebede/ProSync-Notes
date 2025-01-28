import { Module } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
/**
 * Module for handling Supabase-related functionality
 */
export class SupabaseModule {}
