const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const rooms = {};

wss.on('connection', (ws) => {
    console.log('User connected');

    ws.on('message', (data) => {
        const message = JSON.parse(data);

        switch (message.type) {
            case 'joinRoom':
                handleJoinRoom(ws, message);
                break;
            case 'broadcastPdf':
                handleBroadcastPdf(ws, message);
                break;
            default:
                console.error('Unknown message type:', message.type);
        }
    });

    ws.on('close', () => {
        console.log('User disconnected');
        removeUserFromRooms(ws);
    });

    ws.on('error', console.error);
});

function handleJoinRoom(ws, message) {
    const { roomId, role } = message;
    let room = rooms[roomId];

    if (!room) {
        room = {
            senderSocket: null,
            receiverSockets: [],
        };
        rooms[roomId] = room;
    }

    if (role === 'sender') {
        if (room.senderSocket) {
            ws.send(
                JSON.stringify({
                    type: 'error',
                    message: 'Room already has a presenter.',
                })
            );
        } else {
            room.senderSocket = ws;
            ws.send(JSON.stringify({ type: 'success', message: `Presenter joined room: ${roomId}` }));
            console.log(`Presenter joined room: ${roomId}`);
        }
    } else if (role === 'receiver') {
        room.receiverSockets.push(ws);
        ws.send(
            JSON.stringify({
                type: 'success',
                message: `Viewer joined room: ${roomId}`,
                count: room.receiverSockets.length,
            })
        );
        console.log(`Viewer joined room: ${roomId}`);
    }
}

function handleBroadcastPdf(ws, message) {
    const { roomId, data } = message;
    const room = rooms[roomId];

    if (room && room.senderSocket === ws) {
        // Broadcast the PDF data to all receivers in the room
        room.receiverSockets.forEach((receiverSocket) => {
            receiverSocket.send(
                JSON.stringify({
                    type: 'broadcastPdf',
                    data,
                })
            );
        });
    } else {
        console.error('Unauthorized PDF broadcast attempt');
    }
}

function removeUserFromRooms(ws) {
    for (const roomId in rooms) {
        const room = rooms[roomId];

        if (room.senderSocket === ws) {
            room.senderSocket = null;
            console.log(`Presenter left room: ${roomId}`);
        } else {
            room.receiverSockets = room.receiverSockets.filter((viewerSocket) => viewerSocket !== ws);
            console.log(`A viewer left room: ${roomId}`);
        }

        if (!room.senderSocket && room.receiverSockets.length === 0) {
            delete rooms[roomId];
            console.log(`Room ${roomId} deleted`);
        }
    }
}