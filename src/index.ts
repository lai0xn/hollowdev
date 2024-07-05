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
	board: ('X' | 'O' | null)[];
	starter: 0 | 1;
	currentPlayer: 0 | 1; // index of players. x is 0, o is 1
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

	const starter = Math.floor(Math.random() * 2) as 0 | 1;
	const game: Game = {
		roomId,
		players: [],
		board: Array(9).fill(null),
		starter,
		currentPlayer: starter,
	};
	games.push(game);
	res.send({ roomId });
	console.log('new room created', { games });
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
	let playerIndex = -1;

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

		if (game.players.includes(playerName)) {
			console.log('join back', { roomId, playerName });
		} else {
			if (game.players.length >= 2) {
				socket.emit('throw', 'Room is full');
				return;
			}
			console.log('join', { roomId, playerName });
			game.players.push(playerName);
		}

		currentRoom = roomId;
		playerIndex = game.players.indexOf(playerName);
		socket.join(roomId);
		io.to(roomId).emit('update', game);
	});

	socket.on('move', ({ index }) => {
		const game = games.find((game) => game.roomId === currentRoom);
		if (!game) {
			socket.emit('throw', 'Room not found');
			return;
		}

		// prevent cheating
		// Check if it's the player's turn
		if (game.currentPlayer !== playerIndex) {
			socket.emit('throw', 'Not your turn');
			return;
		}

		// Validate index
		if (
			index < 0 ||
			index >= game.board.length ||
			game.board[index] != null
		) {
			socket.emit('throw', 'Invalid move');
			return;
		}

		// Make the move
		game.board[index] = game.currentPlayer === 0 ? 'X' : 'O';
		game.currentPlayer = game.currentPlayer ? 0 : 1;
		io.to(currentRoom).emit('update', game);

		const winState = getWinState(game);
		if (winState) {
			io.to(currentRoom).emit('gameOver', { winState });
			game.board = Array(9).fill(null);
			game.currentPlayer = game.starter;
			game.starter = game.starter ? 0 : 1;
			io.to(currentRoom).emit('update', game);
			return;
		}
	});

	function getWinState(game: Game) {
		const winningCombos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		for (const combo of winningCombos) {
			const [a, b, c] = combo;
			if (
				game.board[a] &&
				game.board[a] === game.board[b] &&
				game.board[a] === game.board[c]
			) {
				const winner =
					game.board[a] == 'X' ? game.players[0] : game.players[1];
				return winner;
			}
		}
		if (game.board.every((cell) => cell !== null)) {
			return 'draw';
		}

		return false;
	}
});

server.listen(3000, () => {
	console.log('Server is running on port 3000');
});
