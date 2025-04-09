import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";

/**
 * Bootstrap the NestJS application
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  // Enable CORS for all origins
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Middleware to log all incoming requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });

  // Redirect `/` to `/api` only for root path
  app.use("/", (req: Request, res: Response, next: NextFunction) => {
    if (req.path === "/") {
      res.redirect("/api");
    } else {
      next();
    }
  });

  // Swagger Setup with Enhanced Metadata
  const swaggerConfig = new DocumentBuilder()
    .setTitle("CollabNote API")
    .setDescription(
      "Comprehensive API documentation for the CollabNote application, an intuitive collaborative notes platform.",
    )
    .setVersion("1.0.0")
    .addBearerAuth()
    .setContact(
      "Son Nguyen",
      "https://github.com/hoangsonww",
      "hoangson091104@gmail.com",
    )
    .setLicense("MIT", "https://opensource.org/licenses/MIT")
    .addServer(
      "https://collabnote-fullstack-app.onrender.com",
      "Production server",
    )
    .addServer("http://localhost:4000", "Development server")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Set up Swagger documentation route
  SwaggerModule.setup("api", app, document, {
    customSiteTitle: "CollabNote API Documentation",
  });

  // Start up the NestJS application
  const port = configService.get<number>("PORT", 4000);
  await app.listen(port, () => {
    logger.log(`NestJS Backend running on port ${port}`);
    logger.log(`Swagger API documentation available at /api`);
  });
}

bootstrap();
