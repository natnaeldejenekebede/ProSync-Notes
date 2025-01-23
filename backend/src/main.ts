import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  // Enable CORS for all origins
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  // Middleware to log all incoming requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });

  // Swagger Setup with Enhanced Metadata
  const swaggerConfig = new DocumentBuilder()
    .setTitle("CollabNote API")
    .setDescription(
      "Comprehensive API documentation for the CollabNote application, an intuitive collaborative notes platform.",
    )
    .setVersion("1.0.0")
    .addBearerAuth() // Add support for JWT tokens
    .setContact(
      "Son Nguyen",
      "https://github.com/hoangsonww",
      "hoangson091104@gmail.com",
    ) // Author Contact Info
    .setLicense("MIT", "https://opensource.org/licenses/MIT") // License Info
    .addServer("http://localhost:4000", "Development server") // Development Server
    .addServer("https://api.collabnote.com", "Production server") // Production Server
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  const port = configService.get<number>("PORT", 4000); // Use PORT from config or default to 4000

  await app.listen(port, () => {
    logger.log(
      `NestJS Backend running on port ${port} and ready for cloud deployment`,
    );
    logger.log(
      `Swagger API documentation available at http://localhost:${port}/api`,
    );
  });
}

bootstrap();
