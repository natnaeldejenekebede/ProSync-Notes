import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
/**
 * Object type for a note
 */
export class Note {
  @Field(() => Int)
  /**
   * The ID of the note
   */
  id: number;

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
   * The tags of the note
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

  @Field({ nullable: true })
  /**
   * The date the note was created
   */
  pinned?: boolean;

  @Field(() => [Int], { nullable: true })
  /**
   * The IDs of the users the note is shared with
   */
  sharedWithUserIds?: number[];

  @Field(() => Int, { nullable: true })
  /**
   * The sort order of the note
   */
  sortOrder?: number;

  @Field({ nullable: true })
  /**
   * The username of the user who created the note
   */
  username?: string;
}
