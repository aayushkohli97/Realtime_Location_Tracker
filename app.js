const express = require('express');
const app = express();
const path = require("path");

const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from "public" folder at root path
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection ///////// iski maa ki chut 

io.on("connection", (socket) => {
    socket.on("send-location",(data) => {
        io.emit("receive-location", {
            id: socket.id, ...data
        });
    })
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
    console.log("Client connected");
});

// Route for homepage
app.get('/', (req, res) => {
    res.render("index");
});

// Start server
server.listen(4000, () => {
    console.log("Server running at http://localhost:3000");
});
