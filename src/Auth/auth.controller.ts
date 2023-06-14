import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() body: any) {
    return this.authService.login(body)
  }
}
