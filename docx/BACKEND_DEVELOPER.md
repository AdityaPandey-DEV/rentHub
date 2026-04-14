# ⚙️ BACKEND DEVELOPER — Complete Code Documentation
## RentHub Property & Room Rental Management System

**Developer Role:** Backend Developer  
**Tech Stack:** Node.js, Express.js 4, Socket.io 4, JWT (jsonwebtoken), bcryptjs, express-validator, Multer  
**Database:** MongoDB with Mongoose ODM  
**Project:** RentHub — Property & Room Rental Management Platform

---

## 📁 Project Structure Overview

```
server/
├── server.js                 ← Main entry point (HTTP + Socket.io)
├── app.js                    ← Express app configuration
├── package.json              ← Dependencies & scripts
├── .env.example              ← Environment variable template
├── config/
│   └── db.js                 ← MongoDB connection setup
├── middleware/
│   ├── auth.js               ← JWT authentication & role authorization
│   ├── errorHandler.js       ← Global error handling middleware
│   └── upload.js             ← File upload (Multer) configuration
├── models/                   ← Mongoose schemas (9 models)
│   ├── User.js, Property.js, Room.js, Booking.js
│   ├── Rental.js, Payment.js, Notification.js
│   └── Chat.js, Message.js
├── controllers/              ← Business logic (8 controllers)
│   ├── authController.js, propertyController.js, roomController.js
│   ├── bookingController.js, rentalController.js, paymentController.js
│   └── chatController.js, notificationController.js
├── routes/                   ← API route definitions (8 route files)
│   ├── authRoutes.js, propertyRoutes.js, roomRoutes.js
│   ├── bookingRoutes.js, rentalRoutes.js, paymentRoutes.js
│   └── chatRoutes.js, notificationRoutes.js
├── seed/                     ← Database seeding scripts
└── uploads/                  ← Uploaded images storage
```

---

## 📄 FILE 1: `server.js` — Main Entry Point (HTTP Server + Socket.io)

```javascript
require('dotenv').config();
```
**Line 1:** Loads environment variables from `.env` file into `process.env`. The `dotenv` package reads the `.env` file in the project root and makes all variables available globally. Example: `MONGODB_URI`, `JWT_SECRET`, `PORT`.

```javascript
const app = require('./app');
```
**Line 2:** Imports the Express application from `app.js`. The app has all middleware, routes, and error handlers configured. Separating `app.js` from `server.js` allows testing the app without starting the server.

```javascript
const connectDB = require('./config/db');
```
**Line 3:** Imports the MongoDB connection function.

```javascript
const http = require('http');
```
**Line 4:** Imports Node.js built-in HTTP module. We need to create an HTTP server manually (instead of using `app.listen()`) because Socket.io needs access to the raw HTTP server.

```javascript
const { Server } = require('socket.io');
```
**Line 5:** Imports the `Server` class from Socket.io — this creates a WebSocket server that enables real-time bidirectional communication between clients and server.

```javascript
connectDB();
```
**Line 8:** Calls the database connection function. This establishes the MongoDB connection before the server starts accepting requests.

```javascript
const PORT = process.env.PORT || 5000;
```
**Line 10:** Gets the port number from environment variables. Falls back to `5000` if not set. In production (Render, Railway), the hosting platform sets `PORT` automatically.

```javascript
const server = http.createServer(app);
```
**Line 13:** Creates an HTTP server using the Express app as the request handler. Every HTTP request goes through Express's middleware pipeline. This server instance is shared with Socket.io.

```javascript
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://renthub-property-management.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
```
**Lines 16-22:** **Socket.io Server Initialization:**
- Attaches Socket.io to the existing HTTP server
- `cors.origin`: Array of allowed frontend URLs (development + production)
- `methods`: Only GET and POST are allowed for WebSocket upgrade
- `credentials: true`: Allows cookies/auth headers in WebSocket handshake

```javascript
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
```
**Lines 25-26:** **Connection Event** — fires whenever a client connects via WebSocket. Each client gets a unique `socket.id`. The `socket` object represents that individual client's connection.

```javascript
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });
```
**Lines 29-32:** **Join Chat Room** — when a user opens a chat, the client emits `join_chat` with the chat ID. `socket.join(chatId)` adds this socket to a "room" — a logical group. Only sockets in the same room receive room-specific messages.

```javascript
  socket.on('send_message', (message) => {
    socket.to(message.chat._id).emit('receive_message', message);
  });
```
**Lines 35-38:** **Send Message** — when a client sends a message:
- `socket.to(chatId)` targets all sockets in that chat room EXCEPT the sender
- `.emit('receive_message', message)` sends the message to the recipient in real-time
- The sender already has the message (they typed it), so we exclude them

```javascript
  socket.on('typing', (chatId) => {
    socket.to(chatId).emit('display_typing', chatId);
  });

  socket.on('stop_typing', (chatId) => {
    socket.to(chatId).emit('hide_typing', chatId);
  });
```
**Lines 42-48:** **Typing Indicators:**
- When user starts typing, `typing` event broadcasts to the chat room
- Other user(s) in the room show "typing..." indicator
- When user stops typing, `stop_typing` hides the indicator
- `socket.to()` ensures the typing user doesn't see their own typing indicator

```javascript
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
```
**Lines 50-53:** **Disconnect Event** — fires when a client closes the browser tab, loses internet, or explicitly disconnects. Used for cleanup (logging, updating online status, etc.).

```javascript
app.set('io', io);
```
**Line 56:** Stores the Socket.io instance in Express app settings. This makes `io` accessible in controllers via `req.app.get('io')` — useful for emitting events from REST API handlers.

```javascript
server.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║   🏠 RentHub API Server                                   ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}   ║
  ║   Port: ${PORT}                                            ║
  ║   URL: http://localhost:${PORT}                            ║
  ║   Socket.io: Enabled                                      ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
});
```
**Lines 58-71:** **Start Server** — binds the HTTP server to the specified port. The callback prints a formatted ASCII box with server details to the console.

```javascript
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
```
**Lines 73-77:** **Global Error Safety Net:**
- Catches any unhandled Promise rejections (async errors without catch blocks)
- Logs the error message
- Gracefully closes the server (stops accepting new connections, finishes existing ones)
- Exits the process with code 1 (failure)

---

## 📄 FILE 2: `app.js` — Express Application Configuration

```javascript
const express = require('express');
```
**Line 1:** Imports Express.js — the web framework that handles HTTP requests, routing, and middleware.

```javascript
const cors = require('cors');
```
**Line 2:** Imports CORS (Cross-Origin Resource Sharing) middleware. By default, browsers block requests from one origin (e.g., `localhost:5173`) to another (e.g., `localhost:5000`). CORS middleware adds headers that allow cross-origin requests.

```javascript
const path = require('path');
```
**Line 3:** Imports Node.js built-in `path` module for working with file paths in a cross-platform way.

```javascript
const errorHandler = require('./middleware/errorHandler');
```
**Line 4:** Imports the global error handling middleware.

```javascript
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
```
**Lines 7-13:** Imports all route modules. Each file defines routes for one resource (auth, properties, rooms, etc.).

```javascript
const app = express();
```
**Line 15:** Creates the Express application instance.

```javascript
app.use(cors({
    origin: ['http://localhost:5173', 'https://renthub-property-management.vercel.app'],
    credentials: true
}));
```
**Lines 18-21:** **CORS Configuration:**
- `origin`: Array of allowed frontend URLs. Only these domains can make API requests.
- `credentials: true`: Allows the frontend to send cookies and Authorization headers.
- `app.use()`: Applies this middleware to ALL routes.

```javascript
app.use(express.json());
```
**Line 24:** **JSON Body Parser** — parses incoming request bodies with `Content-Type: application/json`. After this middleware, `req.body` contains the parsed JSON object.

```javascript
app.use(express.urlencoded({ extended: true }));
```
**Line 25:** **URL-encoded Body Parser** — parses form data (`Content-Type: application/x-www-form-urlencoded`). `extended: true` allows nested objects in form data.

```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```
**Line 28:** **Static File Serving** — makes the `uploads/` directory publicly accessible. A file at `server/uploads/image.jpg` becomes available at `http://localhost:5000/uploads/image.jpg`. `path.join(__dirname, 'uploads')` creates an absolute path.

```javascript
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'RentHub API is running',
        timestamp: new Date().toISOString()
    });
});
```
**Lines 31-37:** **Health Check Endpoint** — a simple GET endpoint to verify the API is running. Used by hosting platforms (Render, Vercel) and monitoring tools to check if the server is alive.

```javascript
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chats', require('./routes/chatRoutes'));
```
**Lines 40-47:** **Route Mounting** — each `app.use()` mounts a router module at a base path:
- `'/api/auth'` + authRoutes: All auth routes start with `/api/auth/...`
- `'/api/properties'` + propertyRoutes: All property routes start with `/api/properties/...`
- This creates a clean, organized API structure

```javascript
app.use(errorHandler);
```
**Line 50:** **Global Error Handler** — placed AFTER all routes. If any route calls `next(error)`, this middleware catches it. Express error handlers must have 4 parameters: `(err, req, res, next)`.

```javascript
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
```
**Lines 53-58:** **404 Catch-all** — if no route matched the request, this middleware returns a 404 error. Must be the LAST middleware.

```javascript
module.exports = app;
```
**Line 60:** Exports the configured Express app for use in `server.js`.

---

## 📄 FILE 3: `middleware/auth.js` — Authentication & Authorization Middleware

```javascript
const jwt = require('jsonwebtoken');
```
**Line 1:** Imports the `jsonwebtoken` library for verifying JWT tokens.

```javascript
const User = require('../models/User');
```
**Line 2:** Imports the User model to look up user data from the database.

```javascript
exports.protect = async (req, res, next) => {
    let token;
```
**Lines 5-6:** **`protect` Middleware** — authenticates the user. Declares `token` variable with `let` (will be assigned conditionally).

```javascript
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
```
**Lines 8-10:** **Extract Token:**
1. Checks if the `Authorization` header exists and starts with `Bearer`
2. Splits `"Bearer eyJhbG..."` by space and takes the second part (index [1]) — the actual token
3. Standard format: `Authorization: Bearer <token>`

```javascript
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
```
**Lines 12-17:** If no token found, return 401 Unauthorized. The `return` stops execution — no further middleware or controller runs.

```javascript
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
**Lines 19-20:** **Verify Token:**
- `jwt.verify()` decodes the token and verifies its signature using the secret key
- If the token is invalid, expired, or tampered with, it throws an error
- `decoded` contains the payload: `{ id: "user_id", role: "tenant", iat: 1234, exp: 5678 }`

```javascript
        req.user = await User.findById(decoded.id);
```
**Line 21:** Looks up the full user document from MongoDB using the `id` from the token payload. Stores it in `req.user` — this makes the user available in ALL subsequent middleware and controllers.

```javascript
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        next();
```
**Lines 23-30:** If the user was deleted from the database but still has a valid token, return 401. Otherwise, call `next()` to pass control to the next middleware or controller.

```javascript
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};
```
**Lines 31-36:** Catches JWT verification errors (expired, invalid, malformed tokens) and returns 401.

```javascript
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role "${req.user.role}" is not authorized to access this route`
            });
        }
        next();
    };
};
```
**Lines 40-50:** **`authorize` Middleware** — role-based access control:
1. `...roles` collects arguments as an array, e.g., `authorize('landlord', 'admin')` → `roles = ['landlord', 'admin']`
2. Returns a middleware function (closure pattern)
3. Checks if `req.user.role` is in the allowed roles array
4. If not, returns 403 Forbidden (authenticated but not authorized)
5. If authorized, calls `next()` to proceed

**Usage in routes:** `router.post('/', protect, authorize('landlord'), createProperty)` — first authenticates, then checks role, then runs the controller.

---

## 📄 FILE 4: `middleware/errorHandler.js` — Global Error Handler

```javascript
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
```
**Lines 2-4:** Express error middleware (4 parameters). Creates a copy of the error object. The spread operator `{...err}` copies own properties, and `err.message` is explicitly copied because `message` is inherited from `Error.prototype`.

```javascript
    console.error(err.stack);
```
**Line 7:** Logs the full error stack trace to the server console for debugging.

```javascript
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }
```
**Lines 10-13:** **Mongoose CastError** — occurs when an invalid MongoDB ObjectId is used in a query (e.g., `/api/rooms/invalid_id`). Converts to a user-friendly 404 error.

```javascript
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        error = { message, statusCode: 400 };
    }
```
**Lines 16-20:** **Mongoose Duplicate Key Error** — occurs when trying to create a document with a unique field that already exists (e.g., registering with an existing email). `err.keyValue` contains `{ email: "test@test.com" }`. Extracts the field name and returns a 400 error.

```javascript
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }
```
**Lines 23-26:** **Mongoose Validation Error** — occurs when schema validation fails (e.g., missing required field, string too long). Collects all validation error messages and joins them with commas.

```javascript
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }
```
**Lines 29-37:** **JWT Errors** — handles invalid and expired tokens with appropriate 401 status codes.

```javascript
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};
```
**Lines 39-42:** **Final Response** — sends the error response. Uses the error's statusCode or defaults to 500 (Internal Server Error). Uses the error message or defaults to "Server Error".

---

## 📄 FILE 5: `middleware/upload.js` — File Upload Configuration (Multer)

```javascript
const multer = require('multer');
const path = require('path');
```
**Lines 1-2:** Imports Multer (file upload middleware) and Node.js path module.

```javascript
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
```
**Lines 5-8:** **Storage Destination** — files are saved to the `uploads/` directory. `cb(null, 'uploads/')` — first arg is error (null = no error), second is the directory path.

```javascript
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
```
**Lines 9-13:** **Filename Generation:**
- Creates a unique suffix using timestamp + random number (prevents filename collisions)
- Final filename format: `avatar-1681234567-987654321.jpg`
- `file.fieldname`: The form field name (e.g., "avatar", "images")
- `path.extname()`: Extracts the original file extension (.jpg, .png, etc.)

```javascript
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
    }
};
```
**Lines 16-26:** **File Type Validation:**
- Defines allowed file types as a regex pattern
- Checks BOTH the file extension AND the MIME type (double validation for security)
- If both match: `cb(null, true)` — accept the file
- If either fails: `cb(new Error(...))` — reject with error message
- This prevents uploading malicious files disguised as images

```javascript
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});
```
**Lines 28-34:** **Final Multer Configuration:**
- `storage`: Use disk storage with custom destination and filename
- `limits.fileSize`: Maximum file size is 5MB (5 × 1024 × 1024 bytes)
- `fileFilter`: Use the validation function defined above

```javascript
module.exports = upload;
```
**Line 36:** Exports the configured multer instance for use in routes.

---

## 📄 FILE 6: `controllers/authController.js` — Authentication Logic

```javascript
const User = require('../models/User');
const { validationResult } = require('express-validator');
```
**Lines 1-2:** Imports User model and `validationResult` function which collects validation errors from `express-validator` middleware.

### Register Function:

```javascript
exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
```
**Lines 7-15:** **Input Validation Check:**
- `validationResult(req)` checks if the validation rules defined in the route (name required, email valid, password length) passed
- If there are errors, returns 400 with the error array
- Example error: `[{ msg: 'Password must be at least 6 characters', param: 'password' }]`

```javascript
        const { name, email, password, phone, role } = req.body;
```
**Line 17:** **Destructuring** — extracts specific fields from the request body. This is cleaner than using `req.body.name`, `req.body.email`, etc. repeatedly.

```javascript
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
```
**Lines 20-26:** **Duplicate Check** — queries MongoDB for a user with the same email. If found, returns 400 error. This is an application-level check in addition to the `unique: true` index on the schema.

```javascript
        const user = await User.create({
            name, email, password, phone,
            role: role || 'tenant'
        });
```
**Lines 29-35:** **Create User** — `User.create()` creates and saves a new document. The password is automatically hashed by the Mongoose `pre('save')` hook in the User model. If no role is specified, defaults to `'tenant'`.

```javascript
        sendTokenResponse(user, 201, res);
```
**Line 37:** Calls helper function to generate JWT and send the response. `201` = Created.

### Login Function:

```javascript
exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        // ... validation check ...

        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
```
**Line 59:** **`.select('+password')`** — by default, the `password` field is excluded from queries (`select: false` in the schema). `+password` explicitly includes it because we need to compare the entered password.

```javascript
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
```
**Lines 61-66:** If no user found with this email, return 401. The message says "Invalid credentials" (not "User not found") to avoid revealing which emails exist in the database (security best practice).

```javascript
        const isMatch = await user.matchPassword(password);
```
**Line 69:** Calls `matchPassword()` method defined on the User model. This uses `bcrypt.compare()` to check if the entered password matches the stored hash. Returns `true` or `false`.

```javascript
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
```
**Lines 71-78:** If password doesn't match, returns the same "Invalid credentials" message (consistent with email not found — prevents brute-force attack information). If matched, sends token.

### Helper: sendTokenResponse

```javascript
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar
        }
    });
};
```
**Lines 189-204:** **Token Response Helper:**
1. `user.getSignedJwtToken()` generates a JWT using the method defined in the User model
2. Returns the token AND a sanitized user object (no password, no internal fields)
3. The frontend stores this token in localStorage and includes it in all subsequent requests

### Other Auth Endpoints:

- **`getMe`** (Lines 87-98): Returns the authenticated user's profile using `req.user.id` (set by `protect` middleware)
- **`updateProfile`** (Lines 103-129): Updates user fields selectively. Removes `undefined` fields so partial updates work (you can update just `name` without touching `phone`)
- **`updatePassword`** (Lines 134-153): Verifies current password before allowing password change
- **`uploadAvatar`** (Lines 158-186): Handles avatar image upload via Multer, saves the file path to the user document

---

## 📄 FILE 7: `controllers/propertyController.js` — Property CRUD

### Get All Properties (Public):

```javascript
exports.getProperties = async (req, res, next) => {
    try {
        const { city, state, propertyType, page = 1, limit = 10 } = req.query;
```
**Line 9:** Extracts query parameters with defaults. `page = 1` means if no `page` param is sent, it defaults to 1. Same for `limit = 10`.

```javascript
        const query = { isActive: true };
        if (city) query['address.city'] = new RegExp(city, 'i');
        if (state) query['address.state'] = new RegExp(state, 'i');
        if (propertyType) query.propertyType = propertyType;
```
**Lines 11-15:** **Dynamic Query Building:**
- Starts with `{ isActive: true }` — only show active properties
- If `city` is provided, adds a case-insensitive regex search on `address.city`
- `new RegExp(city, 'i')`: The `'i'` flag makes it case-insensitive, so "mumbai" matches "Mumbai"
- Only adds filters that are provided — if no city param, no city filter

```javascript
        const skip = (page - 1) * limit;
```
**Line 17:** **Pagination Calculation:** For page 1, skip 0 documents. For page 2 with limit 10, skip 10 documents. Formula: `(page - 1) * limit`.

```javascript
        const properties = await Property.find(query)
            .populate('owner', 'name email phone')
            .skip(skip)
            .limit(parseInt(limit))
            .sort(apiSort);
```
**Lines 22-26:** **MongoDB Query Chain:**
- `.find(query)`: Gets all matching properties
- `.populate('owner', 'name email phone')`: Replaces the `owner` ObjectId with actual user data (only name, email, phone fields)
- `.skip(skip)`: Skips documents for pagination
- `.limit(parseInt(limit))`: Limits results per page
- `.sort(apiSort)`: Sorts results (default: newest first `-createdAt`)

```javascript
        const total = await Property.countDocuments(query);
```
**Line 28:** Gets total count for pagination metadata (total pages calculation).

```javascript
        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: properties
        });
```
**Lines 30-37:** **API Response Format:**
- `count`: Number of records in this page
- `total`: Total matching records across all pages
- `pages`: Total number of pages
- `currentPage`: Current page number
- `data`: The actual property documents

### Create Property:

```javascript
exports.createProperty = async (req, res, next) => {
    try {
        req.body.owner = req.user.id;
        const property = await Property.create(req.body);
```
**Lines 90-94:** Sets the `owner` field to the authenticated user's ID (from `protect` middleware). Then creates the property. The user can't set themselves as a different owner.

### Delete Property:

```javascript
exports.deleteProperty = async (req, res, next) => {
    // ... find property, check ownership ...
    await Room.deleteMany({ property: property._id });
    await property.deleteOne();
```
**Lines 144-166:** When deleting a property:
1. Verifies the property exists and the user owns it
2. **Cascade Delete**: Deletes ALL rooms associated with this property
3. Then deletes the property itself
4. This prevents orphaned room records

---

## 📄 FILE 8: `controllers/roomController.js` — Room CRUD with Advanced Queries

### Get All Rooms (Public - with Complex Filtering):

```javascript
const roomQuery = { status: 'vacant' };
if (minRent) roomQuery.rent = { $gte: parseInt(minRent) };
if (maxRent) roomQuery.rent = { ...roomQuery.rent, $lte: parseInt(maxRent) };
if (roomType) roomQuery.roomType = roomType;
if (amenities) {
    const amenityList = amenities.split(',');
    roomQuery.amenities = { $all: amenityList };
}
```
**Lines 21-29:** **Advanced Query Filters:**
- `$gte`: Greater than or equal (minimum rent)
- `$lte`: Less than or equal (maximum rent)
- `{ ...roomQuery.rent, $lte: ... }`: Spreads existing rent conditions and adds max. Result: `{ $gte: 5000, $lte: 15000 }`
- `$all`: Array must contain ALL specified amenities (AND logic, not OR)
- `amenities.split(',')`: Converts `"wifi,ac,parking"` → `["wifi", "ac", "parking"]`

```javascript
let rooms = await Room.find(roomQuery)
    .populate({
        path: 'property',
        match: {
            isActive: true,
            ...(city && { 'address.city': new RegExp(city, 'i') }),
            ...(state && { 'address.state': new RegExp(state, 'i') })
        },
        populate: {
            path: 'owner',
            select: 'name email phone'
        }
    })
```
**Lines 38-50:** **Nested Population with Conditions:**
- First level: Populates the `property` field of each room
- `match`: Only populates if the property is active AND matches city/state. If match fails, `property` becomes `null`
- Second level `populate`: Inside each populated property, also populates the `owner` field
- This is a 3-level deep data fetch: Room → Property → Owner

```javascript
const validRooms = rooms.filter(room => room.property !== null);
```
**Line 58:** **Post-Population Filter** — rooms whose properties didn't match the `match` condition have `property: null`. This filters them out. This is necessary because Mongoose's `match` in populate doesn't filter the parent documents.

### Create Room:

```javascript
exports.createRoom = async (req, res, next) => {
    const { propertyId } = req.body;
    const property = await Property.findById(propertyId);

    if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({ ... });
    }

    req.body.property = propertyId;
    const room = await Room.create(req.body);

    property.totalRooms += 1;
    if (room.status === 'vacant') {
        property.availableRooms += 1;
    }
    await property.save();
```
**Lines 133-162:** **Room Creation with Property Update:**
1. Finds the property and verifies ownership
2. `.toString()` converts ObjectId to string for comparison (ObjectIds can't be compared with `===`)
3. Creates the room document
4. Updates the parent property's counters (`totalRooms`, `availableRooms`)
5. Saves the property — this keeps denormalized counts in sync

---

## 📄 FILE 9: `controllers/bookingController.js` — Booking Workflow

### Create Booking:

```javascript
exports.createBooking = async (req, res, next) => {
    const room = await Room.findById(roomId).populate('property');
    if (room.status !== 'vacant') {
        return res.status(400).json({ message: 'Room is not available' });
    }

    const existingBooking = await Booking.findOne({
        room: roomId, tenant: req.user.id, status: 'pending'
    });
    if (existingBooking) {
        return res.status(400).json({ message: 'You already have a pending booking' });
    }

    const booking = await Booking.create({ ... });

    await Notification.create({
        user: room.property.owner,
        title: 'New Booking Request',
        message: `New booking for ${room.roomNumber} at ${room.property.title}`,
        type: 'booking',
        relatedId: booking._id
    });
```
**Lines 10-60:** **Multi-step Booking Creation:**
1. Verify room exists and is vacant
2. Check for duplicate pending bookings (prevent spam)
3. Create the booking document
4. Auto-create a notification for the landlord
5. Each step has error handling with appropriate HTTP status codes

### Approve Booking (Most Complex):

```javascript
exports.approveBooking = async (req, res, next) => {
    // 1. Update booking status to 'approved'
    booking.status = 'approved';
    await booking.save();

    // 2. Update room to 'occupied' and set current tenant
    await Room.findByIdAndUpdate(booking.room._id, {
        status: 'occupied',
        currentTenant: booking.tenant
    });

    // 3. Decrease available rooms count
    await Property.findByIdAndUpdate(booking.property._id, {
        $inc: { availableRooms: -1 }
    });

    // 4. Create rental agreement
    const rental = await Rental.create({
        room: booking.room._id,
        property: booking.property._id,
        tenant: booking.tenant,
        landlord: booking.landlord,
        startDate: booking.moveInDate,
        monthlyRent: booking.room.rent,
        deposit: booking.room.deposit
    });

    // 5. Reject all other pending bookings for this room
    await Booking.updateMany(
        { room: booking.room._id, _id: { $ne: booking._id }, status: 'pending' },
        { status: 'rejected', rejectionReason: 'Room rented to another tenant' }
    );

    // 6. Notify the tenant
    await Notification.create({ ... });
```
**Lines 138-218:** **Approval Workflow (6 operations):**
This demonstrates a complex business transaction:
1. Updates booking status
2. Marks room as occupied with the new tenant
3. Decrements available room count
4. Creates a new rental agreement automatically
5. `$ne` (not equal) — rejects all OTHER pending bookings for this room
6. `$inc: { availableRooms: -1 }` — atomic decrement operation (safe for concurrent requests)

---

## 📄 FILE 10: `controllers/paymentController.js` — Payment Logic

### Key Highlights:

```javascript
// Role-based query building
let query = {};
if (req.user.role === 'tenant') {
    query.tenant = req.user.id;
} else if (req.user.role === 'landlord') {
    query.landlord = req.user.id;
}
```
**Lines 12-17:** The same endpoint `/api/payments` returns different data based on user role — tenants see their own payments, landlords see payments from all their tenants.

```javascript
// Payment statistics using MongoDB Aggregation
const stats = await Payment.aggregate([
    { $match: { landlord: req.user._id } },
    {
        $group: {
            _id: '$status',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
        }
    }
]);
```
**Lines 246-255:** **MongoDB Aggregation Pipeline:**
- `$match`: Filters to only this landlord's payments
- `$group`: Groups by `status` (pending/completed/failed)
- `$sum: '$amount'`: Sums the `amount` field for each group
- `$sum: 1`: Counts documents in each group
- Returns: `[{ _id: "completed", total: 50000, count: 5 }, { _id: "pending", total: 10000, count: 2 }]`

---

## 📄 FILE 11: Route Files — API Endpoint Definitions

### `routes/authRoutes.js`:

```javascript
const router = express.Router();

router.post('/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').optional().isIn(['tenant', 'landlord']).withMessage('Role must be tenant or landlord')
    ],
    register
);
```
**Lines 16-30:** **express-validator Chain:**
- `body('name').trim().notEmpty()`: Trims whitespace, then checks if not empty
- `body('email').isEmail()`: Validates email format
- `body('password').isLength({ min: 6 })`: Minimum 6 characters
- `body('role').optional()`: Only validates if role is provided
- `.withMessage()`: Custom error message for each validation
- Validation middleware runs BEFORE the controller (`register`). Any failures are caught by `validationResult(req)` in the controller.

### `routes/propertyRoutes.js` — Middleware Chain Example:

```javascript
router.post('/', protect, authorize('landlord'), createProperty);
```
**Line 24:** **Middleware Execution Order (left to right):**
1. `protect` → Verifies JWT token and sets `req.user`
2. `authorize('landlord')` → Checks if `req.user.role === 'landlord'`
3. `createProperty` → The actual controller function
4. If any middleware fails, it sends a response and the chain stops

```javascript
router.post('/:id/images', protect, authorize('landlord'), upload.array('images', 5), uploadImages);
```
**Line 27-32:** **File Upload Route:**
- `upload.array('images', 5)`: Multer processes up to 5 files from the `images` form field
- After Multer runs, `req.files` contains the uploaded file objects
- Then `uploadImages` controller stores the file paths

---

## 📄 Complete API Endpoint Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login and get JWT token |
| GET | `/me` | ✅ | Get current user profile |
| PUT | `/profile` | ✅ | Update profile |
| PUT | `/password` | ✅ | Change password |
| POST | `/avatar` | ✅ | Upload avatar image |

### Properties (`/api/properties`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ❌ | - | List all properties (with filters) |
| GET | `/:id` | ❌ | - | Get single property |
| GET | `/:propertyId/rooms` | ❌ | - | Get rooms of a property |
| GET | `/me/list` | ✅ | Landlord | Get my properties |
| POST | `/` | ✅ | Landlord | Create property |
| PUT | `/:id` | ✅ | Landlord/Admin | Update property |
| DELETE | `/:id` | ✅ | Landlord/Admin | Delete property |
| POST | `/:id/images` | ✅ | Landlord | Upload images |

### Rooms (`/api/rooms`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ❌ | - | List vacant rooms (with filters) |
| GET | `/:id` | ❌ | - | Get single room |
| POST | `/` | ✅ | Landlord | Create room |
| PUT | `/:id` | ✅ | Landlord/Admin | Update room |
| DELETE | `/:id` | ✅ | Landlord/Admin | Delete room |

### Bookings (`/api/bookings`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/` | ✅ | Tenant | Create booking request |
| GET | `/tenant` | ✅ | Tenant | Get my bookings |
| PUT | `/:id/cancel` | ✅ | Tenant | Cancel booking |
| GET | `/landlord` | ✅ | Landlord | Get booking requests |
| PUT | `/:id/approve` | ✅ | Landlord | Approve booking |
| PUT | `/:id/reject` | ✅ | Landlord | Reject booking |

### Rentals (`/api/rentals`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ✅ | Any | Get rentals (role-based) |
| GET | `/history` | ✅ | Any | Get completed/terminated rentals |
| GET | `/:id` | ✅ | Any | Get single rental |
| PUT | `/:id/terminate` | ✅ | Landlord/Admin | Terminate rental |
| PUT | `/:id/complete` | ✅ | Landlord | Complete rental |

### Payments (`/api/payments`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ✅ | Any | Get payments (role-based) |
| GET | `/pending` | ✅ | Any | Get pending payments |
| GET | `/stats` | ✅ | Landlord | Payment statistics |
| POST | `/` | ✅ | Landlord | Create payment record |
| PUT | `/:id/confirm` | ✅ | Landlord | Confirm payment |
| POST | `/generate` | ✅ | Admin/Landlord | Generate monthly payments |

### Notifications (`/api/notifications`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | Get notifications |
| PUT | `/read-all` | ✅ | Mark all as read |
| DELETE | `/clear` | ✅ | Delete read notifications |
| PUT | `/:id/read` | ✅ | Mark one as read |
| DELETE | `/:id` | ✅ | Delete one notification |

### Chat (`/api/chats`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create/get chat |
| GET | `/` | ✅ | Get all user chats |
| GET | `/:chatId/messages` | ✅ | Get chat messages |
| POST | `/:chatId/messages` | ✅ | Send a message |

---

## 🔑 Key Backend Concepts Summary

### 1. MVC Architecture
**Models** → Data schemas | **Controllers** → Business logic | **Routes** → URL mapping

### 2. Middleware Pipeline
Request flows: `CORS → JSON Parser → Route Matching → protect → authorize → Controller → Error Handler`

### 3. JWT Authentication Flow
`Login → Generate JWT → Client stores in localStorage → Every request includes Bearer token → protect middleware verifies → req.user is set`

### 4. Error Handling Strategy
All controllers use `try/catch` with `next(error)` to pass errors to the global error handler. The error handler normalizes different error types into consistent API responses.

### 5. Real-time Communication
Socket.io runs alongside the HTTP server on the same port. Rooms group sockets for chat. Events: `join_chat`, `send_message`, `typing`, `stop_typing`.

---

*Document prepared for: Backend Developer*  
*Project: RentHub — Property & Room Rental Management System*  
*Last Updated: April 2026*
