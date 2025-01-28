import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
/**
 * Service for handling Supabase-related functionality
 */
export class SupabaseService {
  /**
   * Supabase client
   *
   * @private
   */
  private readonly client: SupabaseClient;

  /**
   * Constructor for the SupabaseService
   *
   * @param configService The ConfigService instance
   */
  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>("SUPABASE_URL") || "";

    const serviceKey =
      this.configService.get<string>("SUPABASE_SERVICE_KEY") || "";

    this.client = createClient(url, serviceKey);
  }

  /**
   * Get the Supabase client
   */
  getClient(): SupabaseClient {
    return this.client;
  }
}
