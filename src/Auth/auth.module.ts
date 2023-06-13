import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { FirebirdClient } from 'src/firebird/firebird.client';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, FirebirdClient],
})
export class AuthModule {}
