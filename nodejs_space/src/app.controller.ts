import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Sistema')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  redirectToDashboard(@Res() res: Response) {
    // Redireciona a página inicial para o Dashboard
    return res.redirect('/admin/index.html');
  }

  @Get('info')
  @ApiOperation({ summary: 'Informações do sistema' })
  getInfo() {
    return {
      nome: 'Banco de Produtos - Sistema de Gerenciamento',
      versao: '1.0.0',
      descricao: 'Sistema completo com API REST e painel administrativo',
      painel_admin: '/admin/index.html',
      documentacao_api: '/api-docs',
      status: 'online',
    };
  }
}
