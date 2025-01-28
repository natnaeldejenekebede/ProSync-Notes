import { Module } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { SupabaseModule } from "../supabase/supabase.module";
import { NotesResolver } from "./notes.resolver";

@Module({
  imports: [SupabaseModule],
  providers: [NotesService, NotesResolver],
  controllers: [NotesController],
})
/**
 * Module for handling note-related functionality
 */
export class NotesModule {}
