const jwt = require('jsonwebtoken');
const { db } = require('../db');
function setupSocket(io) {
io.use((socket, next) => {
try {
const token = socket.handshake.auth.token;
const decoded = jwt.verify(token, process.env.JWT_SECRET);
socket.userId = decoded.userId;
next();
} catch {
next(new Error('Unauthorized'));
}
});
io.on('connection', (socket) => {
socket.join(`user:${socket.userId}`);
socket.on('join_chat', (connectionId) => {
  socket.join(`chat:${connectionId}`);
});

socket.on('send_message', async ({ connectionId, content, type = 'text' }) => {
  try {
    const { rows } = await db.query(
      `INSERT INTO messages (connection_id, sender_id, content, type)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [connectionId, socket.userId, content, type]
    );
    io.to(`chat:${connectionId}`).emit('new_message', rows[0]);
  } catch (err) {
    console.error('Socket message error:', err);
  }
});

socket.on('disconnect', () => {
  console.log(`User ${socket.userId} disconnected`);
});
});
}
module.exports = { setupSocket };