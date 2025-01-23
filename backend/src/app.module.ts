import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { NotesModule } from "./notes/notes.module";
import { ProfileModule } from "./profile/profile.module";
import { SupabaseModule } from "./supabase/supabase.module";

@Module({
  imports: [
    // Loads .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    NotesModule,
    SupabaseModule,
    ProfileModule,
  ],
})
export class AppModule {}
