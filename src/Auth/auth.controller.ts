import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'

@ApiTags('Auth')
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
