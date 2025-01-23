import { Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
export class ProfileService {
  constructor(private readonly supabaseService: SupabaseService) {}

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
