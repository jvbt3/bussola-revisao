import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server: Server;

  private logger = new Logger('AppGateway')
  private messages: {messages: string, clientId: string}[] = []

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.messages.push({messages: payload, clientId: client.id})
    this.server.emit('msgToClient', payload, client.id);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log(this.messages)
    this.messages.forEach((msg) => {
      client.emit('msgToClient', msg.clientId, msg.clientId)
    })
    this.logger.log(`Connected client: ${client.id}`);
    
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Disconnected client: ${client.id}`);
  }

  updatedUser(id: string, data: any){
    this.server.emit('updatedUsers', id, data.name);
  }
}
