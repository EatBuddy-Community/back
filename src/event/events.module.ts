import { Module, Global } from '@nestjs/common';
import { EventsGateway } from './event.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Global() // @Global을 붙이면 다른 모듈(Match 등)에서 편하게 가져다 쓸 수 있습니다.
@Module({
  providers: [EventsGateway, PrismaService],
  exports: [EventsGateway], // 다른 모듈에서 주입받을 수 있도록 내보냅니다.
})
export class EventsModule {}
