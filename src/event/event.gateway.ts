import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // 프론트엔드 주소에 맞춰 설정
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // 접속한 유저들의 소켓 ID를 저장하는 맵 (Memory DB나 Redis 추천)
  private userSockets = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`User ${userId} connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    // 접속 해제 시 맵에서 제거
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  // 특정 유저에게 알림을 쏘는 메서드
  sendNotification(userId: string, payload: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', payload);
    }
  }
}
