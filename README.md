# Fanta20 Asta Agosto - Fantasy Football Auction Platform

A sealed-bid auction platform built for fantasy football leagues. Teams submit their bids confidentially, and results are revealed only after all bids are submitted.

## Features

- ✅ **Sealed-Bid Auctions**: Players cannot see competitors' bids until auction closes
- ✅ **Multiple Sections**: Organize auctions into different sections (Day 1: 4 sections, Day 2: 5 sections)
- ✅ **Budget Management**: Automatic budget tracking and deduction based on highest bids per section
- ✅ **User Authentication**: Secure login and registration for all 20 teams
- ✅ **Admin Dashboard**: Manage players, sections, and view results
- ✅ **Results Display**: See winners and standings after bidding closes

## Tech Stack

- **Frontend**: Next.js + React + TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- PostgreSQL database
- Git

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add:
   - PostgreSQL connection string in `DATABASE_URL`
   - Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
   - Set `NEXTAUTH_URL` (default: http://localhost:3000)

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fanta20-asta-agosto/
├── pages/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── bids/          # Bid submission endpoints
│   │   └── sections/      # Auction section endpoints
│   ├── auth/              # Login & registration pages
│   ├── admin/             # Admin dashboard
│   └── dashboard.tsx      # User dashboard
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static files
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new team
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Bids
- `POST /api/bids/submit` - Submit bids for a section
- `GET /api/bids/user` - Get user's bids

### Sections
- `GET /api/sections` - List all sections
- `GET /api/sections/[id]` - Get section details with players
- `PUT /api/sections/[id]` - Update section (admin only)

## Auction Workflow

1. **User Registration**: Teams register with email, name, and total budget
2. **View Dashboard**: See all auction sections organized by day
3. **Submit Bids**: 
   - Open a section
   - Select up to 6 players
   - Set preference order (1-6)
   - Enter bid amount for each
   - Submit (budget auto-updates with highest bid)
4. **Wait for Results**: After all sections close, results are calculated
5. **View Winners**: See which players each team won

## Budget System

- Each team has a total budget
- When bidding on a section with multiple preferences:
  - The **highest bid** in that section is locked as reserved budget
  - Budget is released/adjusted when moving to next section
  - Only **the one player you win** actually costs the full bid amount
  - If you win player #3 (because #1 and #2 went to others), your budget adjusts to show the actual cost

## Development

### Create migrations
```bash
npx prisma migrate dev --name <migration_name>
```

### Open Prisma Studio
```bash
npx prisma studio
```

### Build for production
```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please create an issue on GitHub.

---

**Fanta20 Asta Agosto** - Making fantasy football auctions fair and transparent! ⚽
