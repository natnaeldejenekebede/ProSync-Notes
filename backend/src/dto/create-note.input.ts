import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
/**
 * Input type for creating a new note
 */
export class CreateNoteInput {
  @Field(() => Int)
  /**
   * The ID of the user who created the note
   */
  userId: number;

  @Field()
  /**
   * The title of the note
   */
  title: string;

  @Field()
  /**
   * The content of the note
   */
  content: string;

  @Field(() => [String], { nullable: true })
  /**
   * The tags associated with the note
   */
  tags?: string[];

  @Field({ nullable: true })
  /**
   * The due date of the note
   */
  dueDate?: string;

  @Field({ nullable: true })
  /**
   * The color of the note
   */
  color?: string;
}
