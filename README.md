# Commerzbank Phishing Panel

A phishing demonstration tool specifically designed for Commerzbank (German bank) educational purposes. This application consists of an administrative panel for monitoring captured data and a realistic phishing site that mimics Commerzbank's login page.

## ⚠️ Educational Use Only

This tool is designed for cybersecurity education and awareness training. It should only be used in controlled educational environments with proper authorization.

## Features

- **Admin Panel**: Real-time monitoring dashboard showing captured credentials with IP addresses
- **Phishing Site**: Realistic Commerzbank login page that captures user credentials
- **Data Capture**: Automatic logging of usernames, passwords, and IP addresses
- **Live Updates**: Admin panel refreshes every 2 seconds to show new captures
- **Export Functionality**: Download captured data as JSON files
- **Database Storage**: PostgreSQL integration for persistent data storage

## Architecture

### Frontend
- React 18 with TypeScript
- Tailwind CSS with shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- Vite for development and building

### Backend
- Node.js with Express.js
- TypeScript with ES modules
- PostgreSQL with Drizzle ORM
- Real-time data persistence

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd commerzbank-phishing-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create a PostgreSQL database and get the connection URL
   export DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Admin Panel: `http://localhost:5000/`
   - Phishing Site: `http://localhost:5000/login`

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NODE_ENV=development
```

## API Endpoints

- `GET /api/stats` - Retrieve session statistics
- `POST /api/phishing-attempts` - Capture login attempt data with IP address
- `GET /api/phishing-attempts` - Retrieve all captured attempts
- `POST /api/reset` - Reset all captured data
- `DELETE /api/phishing-attempts` - Clear captured attempts

## Database Schema

### phishing_attempts
- `id` - Primary key
- `ip_address` - Client IP address
- `username` - Captured username
- `password` - Captured password
- `user_agent` - Browser user agent
- `timestamp` - When the attempt was made

### session_stats
- `id` - Primary key
- `total_attempts` - Total number of attempts
- `scenario_counts` - JSON string of scenario statistics
- `last_reset` - When stats were last reset

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

3. **Set up reverse proxy** (nginx/apache) to handle SSL and domain routing

## Security Considerations

- Always use HTTPS in production
- Implement proper access controls for the admin panel
- Regularly rotate database credentials
- Monitor and log all access attempts
- Use in controlled environments only

## Legal Notice

This tool is for educational purposes only. Users are responsible for ensuring they have proper authorization before deploying this software. Unauthorized use for malicious purposes is prohibited and may be illegal.

## License

This project is for educational use only. Please ensure compliance with local laws and institutional policies before use.

## Support

For educational support and questions, please create an issue in this repository.