import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
/**
 * Object type for a user profile
 */
export class UserProfile {
  @Field(() => Int)
  /**
   * The ID of the user
   */
  id: number;

  @Field()
  /**
   * The username of the user
   */
  username: string;

  @Field()
  /**
   * The email of the user
   */
  email: string;

  @Field()
  /**
   * The date the user was created
   */
  createdAt: string;
}
