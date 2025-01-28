import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  accessToken?: string;
}
