'use strict';

import {Utils} from '../public/app/common/utils';

export class SocketUser {
    private ipAddress: string;
    private socket: SocketIO.Socket;

    constructor(ipAddress: string, socket: SocketIO.Socket) {
        this.ipAddress = ipAddress;
        this.socket = socket;
    }

    dispose(): void {
        this.socket = null;
        this.ipAddress = null;
    }
}

export class SocketEmitter {
    private static _instance: SocketEmitter = new SocketEmitter();

    static get instance(): SocketEmitter {
        return SocketEmitter._instance;
    }

    private users: {[key: string]: SocketUser} = {};
    private io: SocketIO.Server;

    init(server: SocketIO.Server): void {
        server.on('connection', socket => this.connectUser(socket));
        this.io = server;
    }

    broadcast(room: string, event: string, payload: any): SocketEmitter {
        this.io.to(room).emit(event, payload);
        return this;
    }

    connectUser(socket: SocketIO.Socket) {
        let ipAddress = socket.handshake.address;
        this.users[ipAddress] = new SocketUser(ipAddress, socket);

        Utils.log(`User ${ipAddress} connected.`);

        socket
            .on('join-maze', mazeId => {
                if (!mazeId) throw new Error(`User ${ipAddress} tried to join maze but did not pass id`);
                Utils.log(`User ${ipAddress} joined maze ${mazeId}`)
                socket.join(mazeId);
            });

        socket
            .on('disconnect', () => {
                let user = this.users[ipAddress];
                user.dispose();
                delete this.users[ipAddress];
                Utils.log(`User ${ipAddress} disconnected.`);
            });
    }
}