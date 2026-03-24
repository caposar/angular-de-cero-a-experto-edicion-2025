// import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({      
      // ssl: process.env.STAGE === 'prod',
      // extra: {
      //   ssl: process.env.STAGE === 'prod'
      //         ? { rejectUnauthorized: false }
      //         : null,
      // },
      
      // 🔒 Manejo dinámico de SSL
      ssl: process.env.DB_SSL === 'true',
      extra: {
        ssl: process.env.DB_SSL === 'true'
              ? { rejectUnauthorized: false }
              : null,
      },

      // 🗄️ Credenciales explícitas separadas
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,      
      autoLoadEntities: true,
      synchronize: true, // Nota: En .NET Core aquí usarás Migraciones en lugar de synchronize
    }),

    // Se elimina la configuración de archivos estáticos que apuntaba a la carpeta /public inexistente, lo que generaba errores en los logs de producción al buscar el index.html.
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname,'..','public'), 
    // }),

    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessagesWsModule,
    HealthModule,
  ],
})
export class AppModule {}
