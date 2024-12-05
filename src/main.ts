import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle("API de Gestió d'Inventari i Reparacions")
    .setDescription(
      "Documentació de l'API per a gestionar inventari i reparacions en un institut.",
    )
    .setVersion('1.0')
    .addTag('classroom', 'endpoint per a gestionar les aules')
    .addTag(
      'inventory_issues',
      "endpoint per a gestionar les incidències de l'inventari",
    )
    .addTag(
      'inventory_status',
      "endpoint per a gestionar els estats de l'inventari",
    )
    .addTag('inventory_type', "endpoint per a gestionar els tipus d'inventari")
    .addTag(
      'inventory_user',
      "endpoint per a gestionar els usuaris de l'inventari",
    )
    .addTag('inventory', "endpoint per a gestionar l'inventari")
    .addTag('user', 'endpoint per a gestionar els usuaris')
    .addTag('upload', 'endpoint per a pujar arxius')
    .addTag('files', 'endpoint per a gestionar arxius')
    .addTag('statistics', 'endpoint per a obtenir estadístiques')
    .addTag(
      'issues_conversation',
      'endpoint per a gestionar les converses de les incidències',
    )
    .addTag('status', 'endpoint per a gestionar els estats')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
