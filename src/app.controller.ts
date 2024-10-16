import { Controller, Get } from '@nestjs/common'
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator
} from '@nestjs/terminus'

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private memoryHealth: MemoryHealthIndicator
  ) {}

  @Get('healthz')
  @HealthCheck()
  async healthz() {
    const heapUsed = process.memoryUsage().heapUsed
    const rss = process.memoryUsage().rss
    const heapLimit = 1 * 1000 * 1024 * 1024 // 1GB
    const rssLimit = 1 * 1000 * 1024 * 1024 // 1GB

    return this.health.check([
      () => this.memoryHealth.checkHeap('memoryHeap', heapLimit),
      () => this.memoryHealth.checkRSS('memoryRSS', rssLimit),
      () => ({
        memoryDetails: {
          status: 'up',
          heapUsed: `${(heapUsed / 1024 / 1024).toFixed(2)} MB`,
          heapLimit: `${(heapLimit / 1024 / 1024).toFixed(2)} MB`,
          rss: `${(rss / 1024 / 1024).toFixed(2)} MB`,
          rssLimit: `${(rssLimit / 1024 / 1024).toFixed(2)} MB`
        }
      })
    ])
  }
}
