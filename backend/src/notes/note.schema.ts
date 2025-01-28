import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Note {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  dueDate?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  pinned?: boolean;

  @Field(() => [Int], { nullable: true })
  sharedWithUserIds?: number[];

  @Field(() => Int, { nullable: true })
  sortOrder?: number;

  @Field({ nullable: true })
  username?: string;
}
