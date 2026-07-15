import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { HealthService } from './health.service';


@Controller('health')
export class HealthController {
    constructor(private healthService: HealthService) {}

    @Get()
    health() {
        return this.healthService.check();
    }
}
