# 🗄️ DATABASE DEVELOPER — Complete Code Documentation
## RentHub Property & Room Rental Management System

**Developer Role:** Database Developer  
**Tech Stack:** MongoDB (NoSQL Database), Mongoose ODM (Object Document Mapper)  
**Database Name:** `renthub`  
**Project:** RentHub — Property & Room Rental Management Platform

---

## 📁 Files Under This Role

```
server/
├── config/
│   └── db.js                 ← MongoDB connection configuration
├── models/                   ← Mongoose schemas (9 models)
│   ├── User.js               ← User accounts (tenants, landlords, admins)
│   ├── Property.js           ← Property listings
│   ├── Room.js               ← Individual rooms within properties
│   ├── Booking.js            ← Room booking requests
│   ├── Rental.js             ← Active rental agreements
│   ├── Payment.js            ← Rent payment records
│   ├── Notification.js       ← User notifications
│   ├── Chat.js               ← Chat conversations
│   └── Message.js            ← Individual chat messages
├── seed/                     ← Database seeding scripts
│   ├── seed_data.js
│   ├── seed_rooms.js
│   ├── seed_massive.js
│   ├── populate_rooms_direct.js
│   ├── fix_missing_rooms.js
│   └── debug_rooms.js
└── .env.example              ← Database connection string template
```

---

## 📊 Entity Relationship Diagram

```
┌──────────┐       ┌────────────┐       ┌──────────┐
│   User   │──1:N──│  Property  │──1:N──│   Room   │
│(landlord)│       │            │       │          │
└──────────┘       └────────────┘       └──────────┘
     │                                       │
     │                                       │
     │  ┌──────────┐      ┌──────────┐      │
     └──│ Booking  │──────│  Rental  │──────┘
        │(tenant)  │      │          │
        └──────────┘      └──────────┘
                               │
                          ┌──────────┐
                          │ Payment  │
                          └──────────┘

┌──────────┐       ┌──────────┐       ┌──────────────┐
│   User   │──N:N──│   Chat   │──1:N──│   Message    │
└──────────┘       └──────────┘       └──────────────┘

┌──────────┐       ┌──────────────┐
│   User   │──1:N──│ Notification │
└──────────┘       └──────────────┘
```

---

## 📄 FILE 1: `config/db.js` — MongoDB Connection Setup

```javascript
const mongoose = require('mongoose');
```
**Line 1:** Imports Mongoose — an Object Document Mapper (ODM) that provides schema-based modeling for MongoDB. Mongoose adds structure (schemas, validation, type casting) on top of MongoDB's flexible document model.

```javascript
const connectDB = async () => {
```
**Line 3:** Defines an `async` function for database connection. It's `async` because `mongoose.connect()` returns a promise (connecting to a database is asynchronous — it takes time to establish a network connection).

```javascript
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
```
**Line 5:** **Connects to MongoDB** using the connection string from environment variables.
- `process.env.MONGODB_URI` contains the full connection string
- For local development: `mongodb://localhost:27017/renthub`
- For production (MongoDB Atlas): `mongodb+srv://user:pass@cluster.mongodb.net/renthub`
- `await` pauses execution until the connection is established
- `conn` holds the connection object with metadata

```javascript
    console.log(`MongoDB Connected: ${conn.connection.host}`);
```
**Line 6:** Logs the host name of the connected MongoDB server. For local: `localhost`. For Atlas: something like `cluster0-shard-00-00.abc123.mongodb.net`.

```javascript
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
```
**Lines 7-9:** **Error Handling:**
- If connection fails (wrong URI, network issue, authentication error), catches the error
- Logs the error message
- `process.exit(1)`: Terminates the entire Node.js process with exit code 1 (failure)
- This is intentional — the app CANNOT function without a database, so crashing is preferable to running in a broken state

```javascript
};

module.exports = connectDB;
```
**Lines 11-13:** Closes the function and exports it. Called once in `server.js` during startup.

---

## 📄 FILE 2: `models/User.js` — User Schema (CORE MODEL)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
```
**Lines 1-3:** Imports:
- `mongoose`: For defining the schema and model
- `bcryptjs`: For hashing passwords (one-way encryption)
- `jsonwebtoken`: For generating JWT authentication tokens

```javascript
const userSchema = new mongoose.Schema({
```
**Line 5:** Creates a new Mongoose schema. A schema defines the structure, data types, and validation rules for all documents in the `users` collection.

```javascript
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
```
**Lines 6-10:** **`name` field definition:**
- `type: String` — Must be a string value
- `required: [true, 'error message']` — Field is mandatory. Array syntax provides a custom error message (instead of the default Mongoose error)
- `trim: true` — Automatically removes leading/trailing whitespace before saving (e.g., `"  John  "` becomes `"John"`)
- `maxlength: [50, 'error message']` — Maximum 50 characters with custom error

```javascript
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
```
**Lines 12-17:** **`email` field:**
- `unique: true` — MongoDB creates a unique index on this field. Any attempt to insert a duplicate email throws error code 11000
- `lowercase: true` — Automatically converts email to lowercase before saving (e.g., `"John@Gmail.COM"` becomes `"john@gmail.com"`)
- `match`: Regex validation for email format. The regex pattern checks for `word@word.com` structure

```javascript
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
```
**Lines 19-23:** **`password` field:**
- `minlength: [6, ...]` — Minimum 6 characters
- **`select: false`** — CRITICAL SECURITY FEATURE. By default, this field is EXCLUDED from all query results. When you do `User.find()`, the `password` field won't be in the returned documents. To include it, you must explicitly use `.select('+password')`. This prevents accidental password exposure in API responses.

```javascript
    phone: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
```
**Lines 25-27:** **`phone` field:**
- Not required (optional)
- Regex `/^[0-9]{10}$/` validates exactly 10 digits (Indian phone number format)
- `^` = start, `[0-9]{10}` = exactly 10 digits, `$` = end

```javascript
    role: {
        type: String,
        enum: ['landlord', 'tenant', 'admin'],
        default: 'tenant'
    },
```
**Lines 29-32:** **`role` field:**
- `enum`: Restricts the value to ONLY these three options. Any other value throws a validation error
- `default: 'tenant'` — If no role is specified during registration, user is created as a tenant
- This field drives the entire authorization system (who can access what)

```javascript
    avatar: {
        type: String,
        default: ''
    },
```
**Lines 34-36:** **`avatar` field** — stores the file path to the user's profile picture (e.g., `/uploads/avatar-1681234567.jpg`). Defaults to empty string (no avatar).

```javascript
    isVerified: {
        type: Boolean,
        default: false
    },
```
**Lines 38-40:** **`isVerified`** — flag for email verification (not currently enforced in the app, but the schema supports it for future use).

```javascript
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    }
```
**Lines 42-47:** **`address` sub-document** — nested object with multiple fields. In MongoDB, this is stored as an embedded document (not a separate collection). No validation rules here — all fields are optional.

```javascript
}, {
    timestamps: true
});
```
**Lines 48-50:** **Schema Options:**
- `timestamps: true` — Mongoose automatically adds `createdAt` and `updatedAt` fields to every document. `createdAt` is set on insertion, `updatedAt` is updated on every save/update. Both are `Date` type.

```javascript
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
```
**Lines 53-59:** **Pre-save Middleware (Hook):**
- `pre('save')` — runs BEFORE every `document.save()` call
- `this` refers to the document being saved
- `this.isModified('password')` — checks if the password field was changed. Returns `false` if only other fields (like name, phone) were updated. This prevents re-hashing an already hashed password.
- If password wasn't modified: call `next()` to skip hashing
- `bcrypt.genSalt(10)` — generates a random salt with 10 rounds of complexity (higher = more secure but slower. 10 is the standard recommendation)
- `bcrypt.hash(this.password, salt)` — hashes the plain text password with the salt. The result looks like `$2a$10$N9qo8uLOickgx2ZMRZoMye...`
- **Why this matters:** Passwords are NEVER stored in plain text. Even if the database is compromised, attackers see hashed values that cannot be reversed.

```javascript
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
```
**Lines 62-64:** **Instance Method — Password Comparison:**
- `methods` adds a method to every document instance (not the model itself)
- `bcrypt.compare()` takes the entered plain text password and the stored hash, then returns `true` if they match, `false` if they don't
- The `async` keyword is needed because `bcrypt.compare()` returns a Promise
- **How bcrypt compare works:** It extracts the salt from the stored hash, re-hashes the entered password with the same salt, and compares the results

```javascript
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};
```
**Lines 67-71:** **Instance Method — JWT Generation:**
- `jwt.sign(payload, secret, options)` creates a signed JWT token
- **Payload:** `{ id: this._id, role: this.role }` — data encoded in the token (user ID and role). This data can be read by anyone with the token (it's base64 encoded, NOT encrypted), but it can't be tampered with (the signature prevents modification)
- **Secret:** `process.env.JWT_SECRET` — the signing key. Only the server knows this. Used to verify and generate tokens.
- **expiresIn:** `'30d'` — token expires in 30 days. After that, the user must login again.
- **NOT using `arrow function`:** Arrow functions don't have their own `this` context. We need `this` to refer to the user document, so a regular `function` is required.

```javascript
module.exports = mongoose.model('User', userSchema);
```
**Line 73:** **Creates and exports the Model:**
- `mongoose.model('User', userSchema)` creates a model named 'User'
- Mongoose automatically creates/uses a collection named `users` (lowercase, plural)
- The model provides CRUD operations: `User.find()`, `User.create()`, `User.findById()`, etc.

---

## 📄 FILE 3: `models/Property.js` — Property Schema

```javascript
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
```
**Lines 1-8:** **`owner` field — Reference (Foreign Key):**
- `type: mongoose.Schema.Types.ObjectId` — stores a MongoDB ObjectId (24-character hex string like `64a1b2c3d4e5f6a7b8c9d0e1`)
- `ref: 'User'` — tells Mongoose this ObjectId points to the `User` model. This enables `.populate()` to replace the ID with the actual user document
- `required: true` — every property must have an owner
- **This is how MongoDB implements relationships** — unlike SQL foreign keys, there's no database-level enforcement. The application code manages referential integrity.

```javascript
    title: {
        type: String,
        required: [true, 'Please provide a property title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
```
**Lines 9-19:** Standard string fields with validation.

```javascript
    propertyType: {
        type: String,
        enum: ['apartment', 'house', 'villa', 'pg', 'hostel'],
        required: [true, 'Please specify property type']
    },
```
**Lines 20-24:** **`propertyType` enum** — restricts to 5 allowed values: apartment, house, villa, PG (Paying Guest), and hostel.

```javascript
    address: {
        street: {
            type: String,
            required: [true, 'Please provide street address']
        },
        city: {
            type: String,
            required: [true, 'Please provide city']
        },
        state: {
            type: String,
            required: [true, 'Please provide state']
        },
        pincode: {
            type: String,
            required: [true, 'Please provide pincode'],
            match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
        },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
```
**Lines 25-47:** **`address` embedded sub-document:**
- Contains `street`, `city`, `state`, `pincode` (all required)
- `pincode` validates as exactly 6 digits (Indian pincode format)
- `coordinates` stores optional latitude/longitude for map features
- **Embedded vs Referenced:** Address is embedded (not a separate collection) because one address belongs to exactly one property — no need for a separate table

```javascript
    amenities: [{
        type: String,
        enum: ['wifi', 'parking', 'laundry', 'security', 'gym', 'power_backup', 
               'water_supply', 'lift', 'garden', 'cctv', 'ac', 'furnished']
    }],
```
**Lines 48-51:** **`amenities` array of strings:**
- `[{...}]` — the square brackets mean this is an array
- Each element must be one of the 12 predefined amenity values
- Stored in MongoDB as: `["wifi", "parking", "ac"]`
- The enum prevents invalid amenity values from entering the database

```javascript
    images: [{
        type: String
    }],
```
**Lines 52-54:** **`images` array** — stores file paths as strings (e.g., `["/uploads/img1.jpg", "/uploads/img2.jpg"]`).

```javascript
    totalRooms: {
        type: Number,
        default: 0
    },
    availableRooms: {
        type: Number,
        default: 0
    },
```
**Lines 55-62:** **Denormalized Counters:**
- Instead of counting rooms from the `rooms` collection every time (expensive), we pre-calculate and store the counts
- These are updated by the Room controller when rooms are created, deleted, or status changes
- **Trade-off:** Faster reads (no count query needed) but requires careful sync in write operations

```javascript
    views: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
```
**Lines 63-70:** 
- `views` — page view counter for analytics
- `isActive` — soft delete flag. Instead of actually deleting properties, we can set `isActive: false` to hide them from listings while preserving data

```javascript
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
```
**Lines 71-75:** **Schema Options:**
- `timestamps: true` → auto `createdAt` & `updatedAt`
- `toJSON: { virtuals: true }` → includes virtual fields when converting to JSON (for API responses)
- `toObject: { virtuals: true }` → includes virtual fields when converting to objects (for internal use)

```javascript
propertySchema.virtual('rooms', {
    ref: 'Room',
    localField: '_id',
    foreignField: 'property',
    justOne: false
});
```
**Lines 78-83:** **Virtual Population:**
- A "virtual" field is not stored in the database — it's computed when accessed
- This creates a virtual `rooms` array on each Property document
- `ref: 'Room'` — look in the Room collection
- `localField: '_id'` — use this property's `_id`
- `foreignField: 'property'` — match against Room's `property` field
- `justOne: false` — return an array (one property has many rooms)
- Equivalent SQL: `SELECT * FROM rooms WHERE rooms.property_id = property._id`
- Accessed via `.populate('rooms')` in queries

```javascript
propertySchema.index({ 'address.city': 1, 'address.state': 1 });
propertySchema.index({ propertyType: 1 });
```
**Lines 86-87:** **Database Indexes:**
- `index({ 'address.city': 1, 'address.state': 1 })` — creates a compound index on city and state. The `1` means ascending order.
- This dramatically speeds up queries that filter by city and/or state (common in property search)
- `index({ propertyType: 1 })` — index on property type for type-based filtering
- **Without indexes:** MongoDB scans every document (O(n)). **With indexes:** MongoDB uses B-tree lookup (O(log n))
- Trade-off: Indexes speed up reads but slightly slow down writes (index must be updated on every insert/update)

```javascript
module.exports = mongoose.model('Property', propertySchema);
```
**Line 89:** Creates the `Property` model → `properties` collection in MongoDB.

---

## 📄 FILE 4: `models/Room.js` — Room Schema

```javascript
const roomSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
```
**Lines 3-8:** **`property` reference** — every room belongs to exactly one property. This creates the one-to-many relationship (1 Property → N Rooms).

```javascript
    roomNumber: {
        type: String,
        required: [true, 'Please provide room number'],
        trim: true
    },
    roomType: {
        type: String,
        enum: ['single', 'double', 'triple', 'dormitory'],
        required: [true, 'Please specify room type']
    },
```
**Lines 9-18:** 
- `roomNumber`: Identifier like "101", "A-3", etc.
- `roomType`: Restricted to 4 types based on occupancy capacity

```javascript
    rent: {
        type: Number,
        required: [true, 'Please provide monthly rent'],
        min: [0, 'Rent cannot be negative']
    },
    deposit: {
        type: Number,
        required: [true, 'Please provide security deposit'],
        min: [0, 'Deposit cannot be negative']
    },
    area: {
        type: Number,
        min: [0, 'Area cannot be negative']
    },
```
**Lines 19-32:** Numeric fields with `min` validation. `area` is optional (no `required`).

```javascript
    amenities: [{
        type: String,
        enum: ['attached_bathroom', 'balcony', 'ac', 'fan', 'wardrobe', 
               'bed', 'table', 'chair', 'tv', 'geyser', 'wifi']
    }],
```
**Lines 33-36:** Room-level amenities (different from property-level). Rooms have furniture-specific amenities like bed, table, AC etc.

```javascript
    status: {
        type: String,
        enum: ['vacant', 'occupied', 'maintenance'],
        default: 'vacant'
    },
```
**Lines 40-43:** **Room Status:**
- `vacant` → available for booking
- `occupied` → currently rented by a tenant
- `maintenance` → under repair, not available
- Default is `vacant` (new rooms are available)

```javascript
    currentTenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
```
**Lines 45-48:** **`currentTenant` reference** — points to the User who currently lives in this room. `null` when vacant. Updated when booking is approved (set) and rental is completed/terminated (cleared).

```javascript
    availableFrom: {
        type: Date,
        default: Date.now
    },
```
**Lines 50-52:** When the room becomes available. `Date.now` (without parentheses) is a function reference that's called when a document is created — evaluates to the current timestamp at creation time.

```javascript
}, {
    timestamps: true
});
```
**Line 58-60:** Auto timestamps.

```javascript
roomSchema.index({ property: 1, roomNumber: 1 }, { unique: true });
```
**Line 63:** **Compound Unique Index:**
- Makes the combination of `property` + `roomNumber` unique
- Allows room "101" in Property A AND room "101" in Property B, but NOT two "101" rooms in Property A
- This is a **compound index** — it works for queries that search by property, or by property+roomNumber

```javascript
roomSchema.index({ status: 1, rent: 1, roomType: 1 });
```
**Line 66:** **Search Optimization Index** — speeds up the most common query: finding vacant rooms within a rent range of a specific type. The order `status → rent → roomType` matches the typical query pattern.

---

## 📄 FILE 5: `models/Booking.js` — Booking Schema

```javascript
const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
```
**Lines 3-23:** **Four References:**
- `room` → which room is being booked
- `property` → which property the room belongs to (denormalized for easier querying)
- `tenant` → who is requesting the booking
- `landlord` → who owns the property (denormalized — avoids multi-level population)

**Why denormalize `property` and `landlord`?** Without them, to find a landlord's bookings, you'd need: `Booking → Room → Property → Owner`. With denormalization: `Booking → landlord` (direct lookup, much faster).

```javascript
    requestDate: {
        type: Date,
        default: Date.now
    },
    moveInDate: {
        type: Date,
        required: [true, 'Please provide expected move-in date']
    },
```
**Lines 24-31:** 
- `requestDate`: When the booking was created (auto-set to now)
- `moveInDate`: When the tenant wants to move in (required)

```javascript
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
```
**Lines 32-36:** **Booking Status Lifecycle:**
```
Created → pending → approved (by landlord)
                  → rejected (by landlord)
                  → cancelled (by tenant)
```

```javascript
    message: {
        type: String,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    rejectionReason: {
        type: String,
        maxlength: [500, 'Reason cannot exceed 500 characters']
    }
```
**Lines 37-44:** Optional text fields for communication between tenant and landlord.

```javascript
bookingSchema.index({ tenant: 1, status: 1 });
bookingSchema.index({ landlord: 1, status: 1 });
```
**Lines 50-51:** **Query Optimization Indexes:**
- `{ tenant: 1, status: 1 }` — optimizes "Show me all my pending bookings" (tenant dashboard)
- `{ landlord: 1, status: 1 }` — optimizes "Show me all pending booking requests" (landlord dashboard)

---

## 📄 FILE 6: `models/Rental.js` — Rental Agreement Schema

```javascript
const rentalSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
```
**Lines 3-27:** **Five References (Rental bridges all entities):**
- `room`, `property`, `tenant`, `landlord` — same as Booking
- `booking` — links back to the original booking that created this rental (not required — rentals could theoretically be created without bookings)

```javascript
    startDate: {
        type: Date,
        required: [true, 'Please provide start date']
    },
    endDate: {
        type: Date
    },
```
**Lines 28-33:** 
- `startDate`: When the tenant moves in (required)
- `endDate`: When the tenant moves out (optional — set when rental is completed/terminated)

```javascript
    monthlyRent: {
        type: Number,
        required: [true, 'Please provide monthly rent']
    },
    deposit: {
        type: Number,
        required: [true, 'Please provide security deposit']
    },
    depositReturned: {
        type: Boolean,
        default: false
    },
```
**Lines 35-46:** Financial fields:
- `monthlyRent`: The agreed rent amount (copied from room at time of creation — room rent might change later, but this record preserves the original agreement)
- `deposit`: Security deposit amount
- `depositReturned`: Whether the deposit was returned to tenant on checkout

```javascript
    status: {
        type: String,
        enum: ['active', 'completed', 'terminated'],
        default: 'active'
    },
    terminationReason: {
        type: String,
        maxlength: [500, 'Reason cannot exceed 500 characters']
    }
```
**Lines 47-55:** **Rental Status Lifecycle:**
```
Created → active → completed (normal checkout)
                 → terminated (early termination with reason)
```

```javascript
rentalSchema.index({ tenant: 1, status: 1 });
rentalSchema.index({ landlord: 1, status: 1 });
rentalSchema.index({ room: 1, status: 1 });
```
**Lines 61-63:** Three indexes for common queries:
- Tenant viewing their active/past rentals
- Landlord viewing their rental agreements
- Checking if a specific room has an active rental

---

## 📄 FILE 7: `models/Payment.js` — Payment Schema

```javascript
const paymentSchema = new mongoose.Schema({
    rental: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental',
        required: true
    },
    tenant: { ... },
    landlord: { ... },
```
**Lines 3-18:** References to `Rental`, `tenant` (User), and `landlord` (User).

```javascript
    amount: {
        type: Number,
        required: [true, 'Please provide payment amount'],
        min: [0, 'Amount cannot be negative']
    },
```
**Lines 19-22:** Payment amount with non-negative validation.

```javascript
    paymentType: {
        type: String,
        enum: ['rent', 'deposit', 'advance', 'maintenance'],
        required: [true, 'Please specify payment type']
    },
```
**Lines 24-28:** **Payment Types:**
- `rent` — monthly rent payment
- `deposit` — security deposit
- `advance` — advance payment
- `maintenance` — maintenance charges

```javascript
    paymentMethod: {
        type: String,
        enum: ['cash', 'upi', 'card', 'bank_transfer', 'cheque'],
        default: 'cash'
    },
    transactionId: {
        type: String,
        trim: true
    },
```
**Lines 29-37:** 
- `paymentMethod`: How payment was made (5 options, default cash)
- `transactionId`: Reference number for digital payments (optional)

```javascript
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDate: {
        type: Date
    },
    dueDate: {
        type: Date,
        required: [true, 'Please provide due date']
    },
```
**Lines 38-49:** 
- `status`: pending → completed (or failed/refunded)
- `paymentDate`: When payment was actually made (set on confirmation)
- `dueDate`: When payment is due (required)

```javascript
    month: {
        type: String,
        required: [true, 'Please specify the payment month']
    },
    year: {
        type: Number,
        required: [true, 'Please specify the payment year']
    },
```
**Lines 50-57:** `month` and `year` identify which period this payment is for (e.g., "January" 2026).

```javascript
paymentSchema.index({ tenant: 1, status: 1 });
paymentSchema.index({ landlord: 1, status: 1 });
paymentSchema.index({ rental: 1 });
paymentSchema.index({ dueDate: 1, status: 1 });
```
**Lines 67-70:** **Four Indexes:**
- Tenant's payment history/pending payments
- Landlord's received/pending payments
- All payments for a specific rental
- Finding overdue payments (dueDate + status combination)

---

## 📄 FILE 8: `models/Chat.js` — Chat Schema

```javascript
const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
```
**Lines 3-7:** **`participants` array of User references:**
- Stores the ObjectIds of both users in the chat
- Always has exactly 2 elements for a 1-on-1 chat
- Example: `[ObjectId("user1"), ObjectId("user2")]`

```javascript
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
```
**Lines 9-11:** **`lastMessage` reference** — points to the most recent message in this chat. Updated every time a new message is sent. This avoids querying the Message collection just to show the preview in the chat list.

```javascript
    unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    }
```
**Lines 13-17:** **`unreadCounts` — Mongoose Map Type:**
- `Map` stores key-value pairs where keys are user IDs and values are unread counts
- Example: `{ "user1_id": 0, "user2_id": 3 }` means user2 has 3 unread messages
- `of: Number` — Map values must be numbers
- This is efficient: no need for a separate collection to track read status

```javascript
chatSchema.index({ participants: 1 });
```
**Line 23:** Index on participants array. MongoDB indexes support array fields — this makes "find chats where this user is a participant" queries fast.

---

## 📄 FILE 9: `models/Message.js` — Message Schema

```javascript
const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
```
**Lines 3-22:** **Message Fields:**
- `chat`: Which chat this message belongs to
- `sender`: Who sent the message
- `content`: The message text
- `readBy`: Array of user IDs who have read this message

---

## 📄 FILE 10: `models/Notification.js` — Notification Schema

```javascript
const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
        type: String,
        required: [true, 'Please provide notification title'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    message: {
        type: String,
        required: [true, 'Please provide notification message'],
        maxlength: [300, 'Message cannot exceed 300 characters']
    },
    type: {
        type: String,
        enum: ['booking', 'payment', 'rental', 'system', 'chat'],
        default: 'system'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId
    },
    isRead: {
        type: Boolean,
        default: false
    }
```
**Lines 3-30:** **Notification Fields:**
- `user`: Who receives this notification
- `type`: Category of notification (5 types)
- `relatedId`: Generic ObjectId — could point to a Booking, Payment, Rental, or Chat. The `type` field determines what collection it references. This is a **polymorphic reference** pattern — more flexible than separate reference fields for each type
- `isRead`: Read/unread status, defaults to `false` (unread)

```javascript
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
```
**Lines 36-37:** **Indexes:**
- `{ user: 1, isRead: 1 }` — "get all unread notifications for this user"
- `{ createdAt: -1 }` — sort by newest first (descending order, the `-1`)

---

## 📊 Collection Summary

| Collection | Documents Represent | Key Relationships |
|------------|-------------------|-------------------|
| `users` | User accounts | Referenced by all other collections |
| `properties` | Property listings | Owned by User, has many Rooms |
| `rooms` | Individual rooms | Belongs to Property, has currentTenant |
| `bookings` | Booking requests | Links Tenant ↔ Room ↔ Landlord |
| `rentals` | Active rental agreements | Created from approved Booking |
| `payments` | Rent payment records | Linked to Rental |
| `chats` | Chat conversations | Between 2 Users |
| `messages` | Chat messages | Belongs to Chat, sent by User |
| `notifications` | Alert messages | Belongs to User, links to related entity |

---

## 🔑 Key Database Concepts Summary

### 1. Referencing vs Embedding
- **Referenced:** User, Property, Room, Booking are separate collections linked by ObjectIds (like SQL foreign keys)
- **Embedded:** Address is embedded inside Property (no separate collection)
- **Rule of thumb:** Embed data that belongs to one parent and is rarely queried independently. Reference data that's shared or frequently queried independently.

### 2. Denormalization
- `landlord` is stored in Booking AND Rental (could be derived from Property→Owner, but stored for query efficiency)
- `totalRooms`/`availableRooms` on Property (could be counted from Room collection)

### 3. Indexing Strategy
- Compound indexes match common query patterns
- Unique indexes prevent duplicates (email, room number per property)
- Sort indexes support efficient ordering

### 4. Password Security
- bcrypt with salt rounds = 10
- Password field excluded from queries by default (`select: false`)
- Never store or transmit plain text passwords

### 5. Mongoose Middleware (Hooks)
- `pre('save')` for automatic password hashing
- Hooks are transparent — calling code doesn't need to know about them

---

*Document prepared for: Database Developer*  
*Project: RentHub — Property & Room Rental Management System*  
*Last Updated: April 2026*
