# Coach Reva v2.0

Coach Reva is a Progressive Web App (PWA) designed to help couples strengthen their relationships through daily check-ins. The application uses Firebase for authentication and notifications, and Supabase for data storage.

## Features

- **User Authentication**: Secure sign-in with Google through Firebase
- **Daily Prompts**: Receive daily relationship prompts to reflect on
- **Response Tracking**: Record and review your responses to prompts
- **Push Notifications**: Get reminders to complete your daily check-in
- **Offline Support**: PWA capabilities for offline access
- **Mobile-First Design**: Responsive interface optimized for all devices

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Authentication**: Firebase Authentication
- **Database**: Supabase (PostgreSQL)
- **Notifications**: Firebase Cloud Messaging
- **Deployment**: Progressive Web App (PWA)

## Project Structure

```
coach-revaV2/
├── public/                 # Static assets and client-side code
│   ├── css/                # Stylesheets
│   ├── js/                 # Client-side JavaScript
│   ├── images/             # Images and icons
│   ├── index.html          # Main HTML file
│   ├── manifest.json       # PWA manifest
│   └── service-worker.js   # Service worker for PWA
├── server/                 # Server-side code
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   └── routes/             # API routes
├── scripts/                # Utility scripts
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── server.js               # Main server file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Firebase account
- Supabase account

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=3000
NODE_ENV=development

# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/coach-revaV2.git
   cd coach-revaV2
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up the database
   ```
   node scripts/setupDatabase.js
   ```

4. Seed the database with initial prompts
   ```
   node scripts/seedPrompts.js
   ```

5. Start the server
   ```
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Development

### Running in Development Mode

```
npm run dev
```

This will start the server with nodemon, which automatically restarts the server when changes are detected.

### Building for Production

```
npm run build
```

## Deployment

The application can be deployed to any hosting service that supports Node.js applications. For the best PWA experience, use HTTPS in production.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
