import express from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

interface Game {
	roomId: string;
	players: string[];
	board: ('X' | 'O')[];
	currentPlayer: 0 | 1;
}
const games: Game[] = [];

app.get('/', (req, res) => {
	res.send('Hello World');
});
app.post('/create', (req, res) => {
	let roomId = Math.random().toString(36).substring(7);
	while (games.find((game) => game.roomId === roomId)) {
		roomId = Math.random().toString(36).substring(7);
	}

	const game: Game = {
		roomId,
		players: [],
		board: Array(9).fill(''),
		currentPlayer: 0,
	};
	games.push(game);
	res.send({ roomId });
});
app.post('/canJoin', (req, res) => {
	const { roomId } = req.body;
	if (!roomId) {
		res.status(400).send({ error: 'Room ID is required' });
		return;
	}
	const game = games.find((game) => game.roomId === roomId);
	if (game) {
		if (game.players.length < 2) {
			res.send({ canJoin: true });
		} else {
			res.status(400).send({ error: 'Room is full' });
		}
	} else {
		res.status(400).send({ error: 'Room not found' });
	}
});

io.on('connection', (socket) => {
	let currentRoom = '';
	socket.on('join', ({ roomId, playerName }) => {
		const game = games.find((game) => game.roomId === roomId);

		if (currentRoom) {
			socket.emit('throw', 'Already joined a room');
			return;
		}
		if (!game) {
			socket.emit('throw', 'Room not found');
			return;
		}
		if (game.players.length >= 2) {
			socket.emit('throw', 'Room is full');
			return;
		}
		if (!playerName) {
			socket.emit('throw', 'Player name is required');
			return;
		}

		if (game.players.includes(playerName)) {
			console.log('join back', { roomId, playerName });
		} else {
			console.log('join', { roomId, playerName });
			game.players.push(playerName);
		}

		currentRoom = roomId;
		socket.join(roomId);
		io.to(roomId).emit('update', game);
	});
	socket.on('move', ({ index }) => {
		// BUG: check if its the player's turn
		// TODO: validate index, check if game is over
		const game = games.find((game) => game.roomId === currentRoom);
		if (!game) {
			socket.emit('throw', 'Room not found');
			return;
		}
		game.board[index] = game.currentPlayer ? 'X' : 'O';
		game.currentPlayer = game.currentPlayer ? 0 : 1;
		io.to(currentRoom).emit('update', game);
	});
});

server.listen(3000, () => {
	console.log('Server is running on port 3000');
});
