import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Products API')
    .setDescription(
      'REST API for managing product database. This API provides endpoints for querying and managing products, categories, and images.',
    )
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Key for authentication',
      },
      'X-API-Key',
    )
    .addTag('Products', 'Product management endpoints (requires API key)')
    .addTag('Categories', 'Category listing endpoints (requires API key)')
    .addTag('Admin', 'Administrative endpoints (requires admin API key)')
    .addTag('Admin - Products', 'Product CRUD operations (requires admin API key)')
    .addTag('Seed', 'Database initialization endpoint')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Custom CSS for Swagger UI
  const customCss = `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { 
      font-size: 36px; 
      color: #1a1a1a;
      font-weight: 700;
    }
    .swagger-ui .info .description { 
      font-size: 16px;
      line-height: 1.6;
      color: #333;
    }
    .swagger-ui .scheme-container { 
      background: #fafafa; 
      padding: 20px;
      border-radius: 8px;
    }
    .swagger-ui .opblock-tag {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      border-bottom: 2px solid #e0e0e0;
      padding: 15px 0;
    }
    .swagger-ui .opblock {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 6px;
      font-weight: 600;
    }
    .swagger-ui .btn.authorize {
      background-color: #4CAF50;
      border-color: #4CAF50;
    }
    .swagger-ui .btn.authorize:hover {
      background-color: #45a049;
      border-color: #45a049;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: #61affe;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: #49cc90;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background: #fca130;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: #f93e3e;
    }
    .swagger-ui .opblock.opblock-patch .opblock-summary-method {
      background: #50e3c2;
    }
  `;

  const customSiteTitle = 'Products API - Documentation';

  SwaggerModule.setup('api/docs', app, document, {
    customCss,
    customSiteTitle,
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
  logger.log(`🔑 Don't forget to seed the database by calling POST /api/seed`);
}
bootstrap();
