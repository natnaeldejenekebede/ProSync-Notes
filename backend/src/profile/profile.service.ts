import { Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
/**
 * Service for handling profile-related functionality
 */
export class ProfileService {
  /**
   * Constructor for the ProfileService
   * @param supabaseService
   */
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Retrieve a user's profile by ID
   *
   * @param userId The ID of the user
   */
  async getUserProfileById(userId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("users")
      .select("id, username, email, created_at")
      .eq("id", userId);
    if (error) throw error;

    if (!data || data.length === 0)
      throw new NotFoundException("User not found");

    return data[0];
  }

  /**
   * Retrieve a user's profile by username
   *
   * @param username The username of the user
   */
  async getUserProfileByUsername(username: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("users")
      .select("id, username, email")
      .ilike("username", `%${username}%`);

    if (error) throw error;

    return data;
  }
}
