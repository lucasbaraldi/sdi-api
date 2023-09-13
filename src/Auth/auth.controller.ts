import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() body: any) {
    return this.authService.login(body)
  }

  @Post('/refresh-token')
  async refreshToken(@Body() body: any): Promise<any> {
    const refreshToken = body.refreshToken
    const newAccessToken = await this.authService.refreshToken(refreshToken)
    return { accessToken: newAccessToken }
  }
}
