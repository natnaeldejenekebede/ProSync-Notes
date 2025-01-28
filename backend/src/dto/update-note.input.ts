import { InputType, Field, PartialType, Int } from "@nestjs/graphql";
import { CreateNoteInput } from "./create-note.input";

@InputType()
export class UpdateNoteInput extends PartialType(CreateNoteInput) {
  @Field(() => Int)
  id: number;
}
