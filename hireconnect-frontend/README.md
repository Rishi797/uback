# HireConnect - Job Application Management System

A modern, full-stack job application management platform built with React, TypeScript, and tRPC. Features role-based authentication, applicant job submissions with resume uploads, admin dashboards with analytics, and real-time messaging.

## Features

### 🔐 Authentication & Authorization
- **Manus OAuth Integration** - Secure authentication for both applicants and admins
- **Role-Based Access Control** - Separate interfaces for applicants and administrators
- **Session Management** - Persistent login with secure logout

### 👥 Applicant Features
- **Job Browsing** - Search and filter available job positions
- **Job Applications** - Comprehensive application form with validation
- **Resume Upload** - PDF resume upload with file validation (max 5MB)
- **Age Validation** - Blocks applications if applicant age < 18 AND job is not internship
- **Application Tracking** - Real-time status updates (Pending, Reviewed, Selected, Rejected)
- **Inbox** - Centralized view of all applications and admin messages
- **Messaging** - Direct communication with recruiters and admins

### 👨‍💼 Admin Features
- **Dashboard** - Overview with key metrics and quick actions
- **Applications Management** - View all applications with detailed information
- **Advanced Filtering** - Filter by status, position, and location
- **Application Actions** - Accept/Reject applications with status updates
- **Messaging System** - Send responses to applicants
- **Analytics Dashboard** - Comprehensive statistics with charts
  - Status distribution (pie chart)
  - Applications by position (bar chart)
  - Key metrics (total, pending, selected, rejected)
  - Detailed statistics table

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **API**: tRPC for end-to-end type safety
- **Database**: MySQL with Drizzle ORM
- **Routing**: Wouter (lightweight router)
- **Charts**: Recharts for data visualization
- **Notifications**: Sonner for toast notifications
- **Icons**: Lucide React

## Project Structure

```
hireconnect-frontend/
├── client/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── ApplicantLogin.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── ApplicantDashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── JobsListing.tsx
│   │   │   ├── ApplicationForm.tsx
│   │   │   ├── ApplicantApplications.tsx
│   │   │   ├── ApplicantInbox.tsx
│   │   │   ├── AdminApplications.tsx
│   │   │   ├── AdminApplicationDetail.tsx
│   │   │   ├── MessagesPage.tsx
│   │   │   └── AnalyticsDashboard.tsx
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   └── trpc.ts        # tRPC client setup
│   │   ├── App.tsx            # Main app with routing
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   └── public/
├── server/
│   ├── routers.ts             # tRPC procedures
│   ├── db.ts                  # Database queries
│   └── _core/                 # Framework internals
├── drizzle/
│   ├── schema.ts              # Database schema
│   └── migrations/            # SQL migrations
├── shared/
│   └── const.ts               # Shared constants
└── package.json
```

## Database Schema

### Users Table
- `id` - Primary key
- `openId` - Manus OAuth identifier
- `name` - User name
- `email` - Email address
- `mobile` - Phone number
- `dob` - Date of birth
- `role` - User role (applicant/admin)
- `createdAt`, `updatedAt`, `lastSignedIn` - Timestamps

### Jobs Table
- `id` - Primary key
- `title` - Job title
- `description` - Job description
- `position` - Job position/category
- `branch` - Department/branch
- `isInternship` - Boolean flag for internship positions
- `minExperience` - Minimum required experience
- `maxExperience` - Maximum experience level
- `location` - Job location
- `createdAt`, `updatedAt` - Timestamps

### Applications Table
- `id` - Primary key
- `applicantId` - Foreign key to users
- `jobId` - Foreign key to jobs
- `status` - Application status (pending/reviewed/selected/rejected)
- `skills` - Applicant skills
- `experience` - Years of experience
- `lastCompany` - Previous company
- `linkedin` - LinkedIn profile URL
- `relocation` - Relocation willingness
- `city` - Applicant city
- `branch` - Preferred branch
- `visionName` - Career vision name
- `visionSkills` - Vision skills
- `visionDescription` - Career goals
- `dob` - Date of birth (for age validation)
- `resumeUrl` - Resume file URL
- `resumeKey` - Resume file key
- `appliedAt` - Application timestamp

### Messages Table
- `id` - Primary key
- `applicationId` - Foreign key to applications
- `senderId` - Foreign key to users
- `recipientId` - Foreign key to users
- `content` - Message content
- `isRead` - Read status
- `createdAt` - Message timestamp

### Notifications Table
- `id` - Primary key
- `userId` - Foreign key to users
- `title` - Notification title
- `content` - Notification content
- `type` - Notification type
- `isRead` - Read status
- `createdAt` - Notification timestamp

## Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- MySQL database
- Manus OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hireconnect-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/hireconnect
   JWT_SECRET=your_jwt_secret_key
   VITE_APP_ID=your_manus_app_id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://auth.manus.im
   OWNER_OPEN_ID=your_owner_open_id
   OWNER_NAME=Your Name
   ```

4. **Set up the database**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Running the Application

### Development Mode
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Type Checking
```bash
pnpm check
```

### Run Tests
```bash
pnpm test
```

## API Endpoints (tRPC Procedures)

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout current user

### Jobs
- `jobs.list` - Get all active jobs
- `jobs.getById` - Get job details
- `jobs.create` - Create new job (admin only)

### Applications
- `applications.myApplications` - Get user's applications
- `applications.getById` - Get application details
- `applications.list` - Get all applications (admin only)
- `applications.create` - Submit new application
- `applications.updateStatus` - Update application status (admin only)

### Messages
- `messages.getByApplication` - Get messages for application
- `messages.unread` - Get unread messages
- `messages.send` - Send new message
- `messages.markRead` - Mark message as read

### Notifications
- `notifications.list` - Get all notifications
- `notifications.unread` - Get unread notifications
- `notifications.markRead` - Mark notification as read

### Analytics
- `analytics.stats` - Get application statistics

## Key Features Explained

### Age Validation Logic
The application implements the following age validation:
```
IF applicant_age < 18 AND job_type IS NOT internship
  THEN block_application("You must be 18+ for non-internship roles")
```

This ensures that only applicants aged 18 and above can apply for regular positions, while younger applicants can still apply for internship roles.

### Resume Upload
- Accepts PDF files only
- Maximum file size: 5MB
- Files are validated on both client and server
- Resume metadata is stored in the database

### Application Status Flow
1. **Pending** - Initial status when application is submitted
2. **Reviewed** - Admin has reviewed the application
3. **Selected** - Applicant has been selected (positive outcome)
4. **Rejected** - Application has been rejected

### Messaging System
- Applicants and admins can communicate directly
- Messages are tied to specific applications
- Read/unread status tracking
- Real-time notifications on new messages

## Authentication Flow

1. User clicks "Sign In with Manus"
2. Redirected to Manus OAuth portal
3. User authenticates with Manus account
4. Callback to `/api/oauth/callback`
5. Session cookie is set
6. User is redirected to their dashboard based on role

## Deployment

The application is ready for deployment on Manus platform or any Node.js hosting service.

### Deployment Checklist
- [ ] Set all environment variables
- [ ] Configure database connection
- [ ] Run database migrations
- [ ] Build the application
- [ ] Test all features
- [ ] Set up monitoring and logging

## Development Guidelines

### Adding New Features
1. Update database schema in `drizzle/schema.ts`
2. Generate migration: `pnpm drizzle-kit generate`
3. Add database queries in `server/db.ts`
4. Create tRPC procedures in `server/routers.ts`
5. Build UI components in `client/src/pages/`
6. Add routes in `client/src/App.tsx`

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components modular and reusable
- Add proper error handling

## Testing

Run unit tests:
```bash
pnpm test
```

Test coverage includes:
- Authentication flows
- Application submission
- Age validation logic
- Status updates
- Messaging functionality

## Troubleshooting

### Database Connection Issues
- Check DATABASE_URL format
- Verify MySQL is running
- Ensure database exists
- Check user permissions

### OAuth Issues
- Verify VITE_APP_ID is correct
- Check OAUTH_SERVER_URL
- Ensure callback URL is registered
- Check browser cookies are enabled

### Build Issues
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear build cache: `rm -rf dist`
- Run type check: `pnpm check`

## Performance Optimization

- Lazy loading of pages with Wouter
- Optimized database queries with Drizzle
- Efficient state management with React Context
- CSS-in-JS with Tailwind for minimal bundle size
- Image optimization for avatars and icons

## Security Considerations

- All API calls go through tRPC with type safety
- Authentication via Manus OAuth
- Session management with secure cookies
- Role-based access control on all endpoints
- Input validation on client and server
- SQL injection prevention with Drizzle ORM

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues, questions, or suggestions, please open an issue on the repository.

## Changelog

### Version 1.0.0
- Initial release
- Complete applicant and admin features
- Analytics dashboard
- Messaging system
- Age validation logic
- Resume upload functionality

---

**Built with ❤️ using React, TypeScript, and tRPC**
