import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { NotesService } from "./notes.service";
import { Note } from "./notes.schema";
import { CreateNoteInput } from "../dto/create-note.input";
import { UpdateNoteInput } from "../dto/update-note.input";

@Resolver(() => Note)
/**
 * Resolver for note-related functionality
 */
export class NotesResolver {
  /**
   * Constructor for the NotesResolver
   *
   * @param notesService The NotesService instance
   */
  constructor(private readonly notesService: NotesService) {}

  @Query(() => [Note], { name: "getUserNotes" })
  /**
   * Retrieve notes for a specific user
   */
  async getUserNotes(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("searchQuery", { type: () => String, nullable: true })
    searchQuery?: string,
    @Args("tagFilter", { type: () => String, nullable: true })
    tagFilter?: string,
  ) {
    return this.notesService.getUserNotes(userId, searchQuery, tagFilter);
  }

  @Mutation(() => Note)
  /**
   * Create a new note
   */
  async createNote(@Args("createNoteInput") createNoteInput: CreateNoteInput) {
    return this.notesService.createNote({
      userId: createNoteInput.userId,
      title: createNoteInput.title,
      content: createNoteInput.content,
      tags: createNoteInput.tags,
      dueDate: createNoteInput.dueDate,
      color: createNoteInput.color,
    });
  }

  @Mutation(() => Note)
  /**
   * Update an existing note
   */
  async updateNote(
    @Args("noteId", { type: () => Int }) noteId: number,
    @Args("userId", { type: () => Int }) userId: number,
    @Args("updates") updates: UpdateNoteInput,
  ) {
    return this.notesService.updateNote(noteId, userId, updates);
  }
}
