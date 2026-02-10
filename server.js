const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allows any frontend to connect during hackathon
        methods: ["GET", "POST"]
    }
});

// Game State Storage
let games = {}; 

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_game', (room) => {
        socket.join(room);
        
        // Initialize game state if room is new
        if (!games[room]) {
            games[room] = {
                activeCard: { symbol: 'Cl', name: 'Chlorine', type: 'Non-Metal', group: 'Halogen' },
                turn: 0,
                players: []
            };
        }
        
        games[room].players.push(socket.id);
        socket.emit('init_game', games[room]);
    });

    // Handle Card Play
    socket.on('play_card', (data) => {
        const { room, card, isReaction } = data;
        
        // Update the server's master state
        games[room].activeCard = card;
        
        // Broadcast move to everyone else in the room
        socket.to(room).emit('opponent_moved', {
            card: card,
            isReaction: isReaction,
            message: isReaction ? "🔥 Opponent triggered a REACTION!" : "Opponent played a card."
        });
    });

    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`ChemChain Server running on port ${PORT}`);
});
