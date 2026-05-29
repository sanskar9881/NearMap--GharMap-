const jwt = require('jsonwebtoken');
function authenticate(req, res, next) {
const header = req.headers.authorization;
if (!header) return res.status(401).json({ error: 'No token provided' });
const token = header.replace('Bearer ', '');
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = { id: decoded.userId };
next();
} catch {
res.status(401).json({ error: 'Invalid token' });
}
}
module.exports = { authenticate };