import { Controller, Get, Logger, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger'; // 👈 Importamos de swagger

@ApiTags('Health') // 👈 Esto cambia el nombre en la documentación
@Controller('health')
export class HealthController {
  private readonly logger = new Logger('HealthController');

  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async checkHealth() {
    try {
      await this.dataSource.query('SELECT 1 as result');
      return {
        status: 'ok',
        db: 'up',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('💥 Error crítico: Conexión a la BD fallida', error);
      throw new ServiceUnavailableException({ status: 'error', db: 'down' });
    }
  }
}
