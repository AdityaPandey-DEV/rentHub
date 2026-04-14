# 🏠 RentHub — Property Rental Management Platform

A fullstack **Next.js 15** property rental platform deployed on **Vercel** with **MongoDB Atlas**. Find verified rental properties, connect with landlords, and manage bookings — all in one place.

## ✨ Features

### For Tenants
- 🔍 Search & filter rooms by city, type, budget, amenities
- 📝 Send booking requests to landlords
- 📊 Dashboard with active rentals & booking status
- 🔔 Real-time notifications

### For Landlords
- 🏗️ Create & manage properties and rooms
- ✅ Approve/Reject booking requests
- 💰 Track payments and rental agreements
- 📊 Portfolio overview dashboard

### Platform
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design
- 🔐 JWT authentication with role-based access
- ⚡ Serverless API routes (Vercel-optimized)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + Custom CSS |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| Deployment | Vercel |
| Icons | React Icons |
| Notifications | React Hot Toast |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # Serverless API routes
│   │   ├── auth/      # Login, Register, Profile
│   │   ├── properties/# CRUD properties
│   │   ├── rooms/     # CRUD rooms
│   │   ├── bookings/  # Booking management
│   │   ├── rentals/   # Rental agreements
│   │   ├── payments/  # Payment tracking
│   │   └── notifications/
│   ├── properties/    # Properties listing & detail
│   ├── rooms/         # Rooms listing & detail
│   ├── landlord/      # Landlord dashboard
│   ├── tenant/        # Tenant dashboard
│   ├── login/         # Auth pages
│   ├── register/
│   └── notifications/
├── components/
│   ├── home/          # Landing page sections
│   ├── layout/        # Navbar, Footer
│   └── providers/     # Auth, Theme providers
├── hooks/             # Custom React hooks
└── lib/
    ├── models/        # Mongoose models
    ├── db.js          # MongoDB connection
    └── auth.js        # JWT utilities
```

## 🚀 Deployment

This project is designed for one-click Vercel deployment.

### Environment Variables (set in Vercel Dashboard)

| Variable | Description |
|----------|------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRE` | Token expiration (default: `30d`) |

## 📝 License

MIT
