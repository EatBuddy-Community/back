import { Injectable } from "@nestjs/common";
import { ActivityRepository } from "./activity.repository";

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async getMyActivities(userId: string) {
    return this.activityRepository.findByUserId(userId);
  }
}