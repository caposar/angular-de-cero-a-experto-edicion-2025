import { Controller, Get, Logger, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; // 👈 Importamos de swagger

@ApiTags('Health') // 👈 Esto cambia el nombre en la documentación
@Controller('health')
export class HealthController {
  private readonly logger = new Logger('HealthController');

  constructor(private readonly dataSource: DataSource) {}

  // 1️⃣ Endpoint para Render: Ultraligero, NO toca la BD
  @Get()
  @ApiOperation({ 
    summary: 'Verifica el estado del servidor (Liveness Probe)', 
    description: 'Endpoint ultraligero diseñado para el Health Check interno de Render. No interactúa con la base de datos para evitar consumo de cuota.' 
  })
  @ApiResponse({ status: 200, description: 'El servidor está activo y respondiendo.' })
  checkServerHealth() {
    return { 
      status: 'ok', 
      message: 'Server up', 
      timestamp: new Date().toISOString() 
    };
  }

  // 2️⃣ Endpoint para UptimeRobot: SÍ toca la BD
  @Get('db')
  @ApiOperation({ 
    summary: 'Verifica el estado de la Base de Datos (Readiness Probe)', 
    description: 'Endpoint profundo diseñado para monitores externos (BetterStack/UptimeRobot). Ejecuta un ping a la base de datos.' 
  })
  @ApiResponse({ status: 200, description: 'La conexión a la base de datos es exitosa.' })
  @ApiResponse({ status: 503, description: 'Error crítico: La base de datos no responde.' })
  async checkDatabaseHealth() {
    try {
      await this.dataSource.query('SELECT 1 as result');
      
      return { 
        status: 'ok', 
        message: 'Database up', 
        timestamp: new Date().toISOString() 
      };
    } catch (error) {
      this.logger.error('Error crítico: Conexión a la BD fallida', error);
      
      throw new ServiceUnavailableException({ 
        status: 'error', 
        message: 'Database down' 
      });
    }
  }
}
