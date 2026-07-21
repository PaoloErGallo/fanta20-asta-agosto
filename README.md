# Fanta20 Asta Agosto

An interactive fantasy football auction platform with sealed bidding mechanics, budget tracking, and administrative oversight.

## Features

- **User Authentication**: Secure login and registration with NextAuth
- **Sealed Bidding**: Place confidential bids on players across multiple auction sections
- **Budget Management**: Track individual and aggregate budget allocation
- **Multi-Day Auctions**: Organize players into sections across multiple days
- **Admin Dashboard**: Monitor all teams, budgets, and auction progress
- **Preference Rankings**: Bid with preference rankings (1-6) for strategic selection

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Security**: bcrypt for password hashing

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PaoloErGallo/fanta20-asta-agosto.git
   cd fanta20-asta-agosto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and configure:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Application URL (http://localhost:3000 for development)

4. **Initialize the database**
   ```bash
   npx prisma db push
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
fanta20-asta-agosto/
├── pages/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── bids/              # Bid management endpoints
│   │   ├── sections/          # Auction sections endpoints
│   │   └── admin/             # Admin endpoints
│   ├── admin/                 # Admin dashboard
│   ├── auction/               # Auction bidding pages
│   ├── auth/                  # Authentication pages
│   ├── dashboard.tsx          # User dashboard
│   └── index.tsx              # Home page
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Database Schema

### User
- Email, name, password (hashed)
- Team information and budget tracking
- Admin flag for role-based access

### Player
- Player details (name, position, club)
- Associated with auction sections

### AuctionSection
- Name, day, order
- Status (upcoming, active, completed)
- Contains multiple players

### Bid
- Links user, player, and section
- Amount and preference ranking (1-6)
- Status tracking (pending, won, lost)

### SectionBudget
- Tracks maximum bid per section per user
- Used for budget allocation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new team
- `POST /api/auth/[...nextauth]` - NextAuth authentication

### Bids
- `POST /api/bids/submit` - Submit sealed bids for a section

### Sections
- `GET /api/sections` - List all auction sections
- `GET /api/sections/[id]` - Get section details

### Admin
- `GET /api/admin/users` - List all users and budgets (admin only)

## Usage

### For Users

1. Register with your team details and initial budget
2. View available auction sections on your dashboard
3. Click "Place Bids" on active sections
4. Enter bid amounts and preference rankings for each player
5. Submit bids - your highest bid locks the reserved budget
6. Monitor your remaining budget in real-time

### For Administrators

1. Access the admin dashboard at `/admin`
2. Monitor all teams and their budget allocation
3. View real-time spending across the auction
4. Track auction section status and progress

## Development

### Database Management

```bash
# Push schema changes
npm run db:push

# Open Prisma Studio for data management
npm run db:studio

# Generate Prisma client after schema changes
npm run prisma:generate
```

### Building for Production

```bash
npm run build
npm run start
```

## Security Considerations

- All passwords are hashed with bcrypt (salt rounds: 10)
- JWT tokens used for session management
- Database queries use Prisma for SQL injection prevention
- Admin routes check user permissions
- Bids are immutable once submitted

## License

Proprietary - All rights reserved

## Support

For issues or questions, please contact the development team.
