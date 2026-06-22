import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Post()
  create(@Body() dto: CreatePlanDto) {
    // TEMP: fake userId
    return this.plansService.create("testUserId", dto);
  }

  @Get()
  findAll() {
    return this.plansService.findAll("testUserId");
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Post(':id/generate')
  async generate(@Param('id') id: string) {
    const layout = {
      rooms: [
        {
          name: "Bedroom",
          polygon: [[0,0],[0,5],[5,5],[5,0]],
        },
        {
          name: "Kitchen",
          polygon: [[5,0],[5,5],[10,5],[10,0]],
        }
      ]
    };

    return this.plansService.saveLayout(id, layout);
  }

}