import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SupabaseModule } from "../supabase/supabase.module";
import { JwtStrategy } from "./jwt.strategy";
import { AuthResolver } from "./auth.resolver";

@Module({
  imports: [
    SupabaseModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: config.get<string>("JWT_EXPIRES_IN"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  controllers: [AuthController],
})
/**
 * Module for handling authentication-related functionality
 */
export class AuthModule {}
