import { Server } from 'socket.io';
import Redis from 'ioredis';

const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: 25072,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD
});
const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: 25072,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log('Init socket server...');
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*'
      }
    });

    sub.subscribe('MESSAGES');
  }

  public initListeners() {
    const io = this.io;
    console.log('Init socket listeners...');

    io.on('connect', (socket) => {
      console.log(`New socket connected: ${socket.id}`);

      socket.on('event:message', async ({ message }: { message: string }) => {
        console.log(`New message received: ${message}`);
        // Now, publish this message to redis.
        await pub.publish('MESSAGES', JSON.stringify({ message }))
      });
    });

    sub.on('message', (channel, message) => {
      if (channel === 'MESSAGES') {
        console.log('New msg from redis', message);
        io.emit("message", message);
      }
    })
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
