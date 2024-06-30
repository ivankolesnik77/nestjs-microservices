import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { StripeService } from "../modules/stripe/stripe.service";
import { Logger } from "@nestjs/common";

@WebSocketGateway(8081, {
  cors: true,
  transports: ["websocket", "polling"],
})
export class MyWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger("Socket");
  constructor(private readonly stripeService: StripeService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.stripeService.registerClient(client);
  }

  emitMessage(key: string, value: string) {
    this.server.emit(key, { value });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Unregister the client
    this.stripeService.unregisterClient(client);
  }

  afterInit(server: any) {
    this.logger.log("Initialized");
  }
}
