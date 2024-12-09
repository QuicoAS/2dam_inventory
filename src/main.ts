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
    .addTag('classrooms', 'Endpoints per a gestionar les aules')
    .addTag('files', 'Endpoints per a gestionar arxius')
    .addTag(
      'inventory',
      "Endpoints per a gestionar l'inventari i els seus tipus, estats i incidències",
    )
    .addTag(
      'issues',
      'Endpoints per a gestionar les incidències i les seves converses i estats',
    )
    .addTag('statistics', 'Endpoints per a obtenir estadístiques')
    .addTag('users', 'Endpoints per a gestionar els usuaris')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
