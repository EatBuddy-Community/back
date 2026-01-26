import { Controller, Get, Query } from "@nestjs/common";
import { ActivityService } from "./activity.service";

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getMyActivities(@Query('userId') userId: string) { // 나중에 JWT 가드 적용 대상
    return this.activityService.getMyActivities(userId);
  }
}