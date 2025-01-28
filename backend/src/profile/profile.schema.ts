import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class UserProfile {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  createdAt: string;
}
