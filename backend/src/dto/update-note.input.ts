import { InputType, Field, PartialType, Int } from "@nestjs/graphql";
import { CreateNoteInput } from "./create-note.input";

@InputType()
/**
 * Input type for updating an existing note
 */
export class UpdateNoteInput extends PartialType(CreateNoteInput) {
  @Field(() => Int)
  /**
   * The ID of the note to update
   */
  id: number;
}
