import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class CreateNoteInput {
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
}
