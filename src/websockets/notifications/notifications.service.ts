import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@Injectable()
@WebSocketGateway(3006, { cors: true })
export class NotificationsService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsService.name);

  notifyJobStatus(status: string) {
    //client.broadcast.to(client.id).emit('JobStatus', status);
    this.server.emit('JobStatus', status);
  }

  afterInit() {
    this.logger.log('Websocket Server Started,Listening on Port:3006');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
}
