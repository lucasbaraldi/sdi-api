import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]
    if (!token) {
      return false
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET)
      request.userData = decoded

      return true
    } catch (error) {
      console.log('Erro na verificação do token:', error)
      return false
    }
  }
}
