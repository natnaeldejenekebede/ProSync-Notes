import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
/**
 * Service for handling note-related functionality
 */
export class NotesService {
  /**
   * Constructor for the NotesService
   *
   * @param supabaseService The SupabaseService instance
   */
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Retrieve notes for a user
   *
   * @param userId The ID of the user
   * @param searchQuery The search query to filter notes
   * @param tagFilter The tag to filter notes
   */
  async getUserNotes(userId: number, searchQuery?: string, tagFilter?: string) {
    let query = this.supabaseService
      .getClient()
      .from("notes")
      .select()
      // This OR means: user_id == current user OR current user is in shared_with_user_ids
      .or(`user_id.eq.${userId},shared_with_user_ids.cs.{${userId}}`)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: false });

    if (searchQuery) {
      // search title using ilike
      query = query.ilike("title", `%${searchQuery}%`);
    }

    if (tagFilter) {
      // filter notes containing tagFilter in tags array
      query = query.contains("tags", [tagFilter]);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  /**
   * Create a new note
   *
   * @param noteData The data for the new note
   */
  async createNote(noteData: {
    userId: number;
    title: string;
    content: string;
    tags?: string[];
    dueDate?: string;
    color?: string;
  }) {
    const { userId, title, content, tags, dueDate, color } = noteData;
    const { data, error } = await this.supabaseService
      .getClient()
      .from("notes")
      .insert([
        {
          user_id: userId,
          title,
          content,
          tags: tags || [],
          due_date: dueDate || null,
          color: color || "#ffffff",
          pinned: false,
          shared_with_user_ids: [],
          sort_order: 999999,
        },
      ])
      .select(); // returns newly inserted row

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  /**
   * Update an existing note
   *
   * @param noteId The ID of the note
   * @param userId The ID of the user
   * @param updates The updates to apply to the note
   */
  async updateNote(noteId: number, userId: number, updates: any) {
    const { data: existing, error: findError } = await this.supabaseService
      .getClient()
      .from("notes")
      .select()
      .eq("id", noteId);

    if (findError) throw findError;

    if (!existing || existing.length === 0) {
      throw new NotFoundException("Note not found");
    }

    const note = existing[0];
    const isOwner = note.user_id === userId;
    const isSharedWithUser = note.shared_with_user_ids?.includes(userId);

    if (!isOwner && !isSharedWithUser) {
      throw new BadRequestException("You cannot update this note");
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from("notes")
      .update(updates)
      .eq("id", noteId)
      .select();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  /**
   * Get the user ID from a username
   *
   * @param username The username to search for
   */
  async getUserIdFromUsername(username: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle(); // Change single() to maybeSingle()

    if (error) throw error; // Throw the error if the query fails

    if (!data) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }

    return data.id;
  }

  /**
   * Share a note with another user
   *
   * @param noteId The ID of the note
   * @param ownerId The ID of the owner
   * @param targetUserName The username of the user to share the note with
   */
  async shareNoteWithUser(
    noteId: number,
    ownerId: number,
    targetUserName: string,
  ) {
    // Get user ID from username
    const targetUserId = await this.getUserIdFromUsername(targetUserName);

    const { data: existing, error: findError } = await this.supabaseService
      .getClient()
      .from("notes")
      .select()
      .eq("id", noteId)
      .single();

    if (findError) throw findError;

    if (!existing) {
      throw new NotFoundException("Note not found");
    }

    if (existing.user_id !== ownerId) {
      throw new BadRequestException("You are not the owner of this note");
    }

    const updatedSharedWith = existing.shared_with_user_ids || [];

    if (!updatedSharedWith.includes(targetUserId)) {
      updatedSharedWith.push(targetUserId);
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from("notes")
      .update({ shared_with_user_ids: updatedSharedWith })
      .eq("id", noteId)
      .select();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  /**
   * Remove a note for a user
   *
   * @param noteId The ID of the note
   * @param userId The ID of the user
   */
  async removeNoteForUser(noteId: number, userId: number) {
    const { data: existing, error: findError } = await this.supabaseService
      .getClient()
      .from("notes")
      .select()
      .eq("id", noteId)
      .single();

    if (findError) throw findError;

    if (!existing) {
      throw new NotFoundException("Note not found");
    }

    // If user is owner, fully delete
    if (existing.user_id === userId) {
      const { error: delErr } = await this.supabaseService
        .getClient()
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (delErr) throw new BadRequestException(delErr.message);

      return { message: "Note deleted from system" };
    } else {
      // If not owner, remove user from shared_with_user_ids
      if (!existing.shared_with_user_ids?.includes(userId)) {
        throw new BadRequestException(
          "You do not have access to remove this note",
        );
      }

      const updatedSharedWith = existing.shared_with_user_ids.filter(
        (id: any) => id !== userId,
      );

      const { error: updateErr } = await this.supabaseService
        .getClient()
        .from("notes")
        .update({ shared_with_user_ids: updatedSharedWith })
        .eq("id", noteId);

      if (updateErr) {
        throw new BadRequestException(updateErr.message);
      }

      return { message: "Note removed for this user only" };
    }
  }

  /**
   * Reorder notes for a user
   *
   * @param userId The ID of the user
   * @param noteOrder The new order of note IDs
   */
  async reorderNotes(userId: number, noteOrder: number[]) {
    // For each note ID in the new order, set sort_order = index
    for (let i = 0; i < noteOrder.length; i++) {
      const id = noteOrder[i];

      await this.supabaseService
        .getClient()
        .from("notes")
        .update({ sort_order: i })
        .eq("id", id)
        .or(`user_id.eq.${userId},shared_with_user_ids.cs.{${userId}}`);
    }

    return { message: "Notes reordered" };
  }
}
