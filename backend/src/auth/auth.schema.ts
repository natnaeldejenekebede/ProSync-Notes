import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
/**
 * Object type for the response of the authentication process
 */
export class AuthResponse {
  @Field()
  /**
   * The message of the response
   */
  message: string;

  @Field({ nullable: true })
  /**
   * The access token for the user
   */
  accessToken?: string;
}
