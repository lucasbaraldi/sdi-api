import { Body, Controller, Res, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { Response } from 'express'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: any, @Res() res: Response): Promise<any> {
    return this.authService.login(body, res)
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response
  ): Promise<any> {
    return this.authService.refreshToken(refreshToken, res)
  }
}
