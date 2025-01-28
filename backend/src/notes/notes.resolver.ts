import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { NotesService } from "./notes.service";
import { Note } from "./note.schema";
import { CreateNoteInput } from "../dto/create-note.input";
import { UpdateNoteInput } from "../dto/update-note.input";

@Resolver(() => Note)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Query(() => [Note], { name: "getUserNotes" })
  async getUserNotes(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("searchQuery", { type: () => String, nullable: true })
    searchQuery?: string,
    @Args("tagFilter", { type: () => String, nullable: true }) tagFilter?: string,
  ) {
    return this.notesService.getUserNotes(userId, searchQuery, tagFilter);
  }

  @Mutation(() => Note)
  async createNote(
    @Args("createNoteInput") createNoteInput: CreateNoteInput,
  ) {
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
  async updateNote(
    @Args("noteId", { type: () => Int }) noteId: number,
    @Args("userId", { type: () => Int }) userId: number,
    @Args("updates") updates: UpdateNoteInput,
  ) {
    return this.notesService.updateNote(noteId, userId, updates);
  }
}
