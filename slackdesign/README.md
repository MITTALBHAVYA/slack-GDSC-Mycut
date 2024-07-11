# GDSC Slack App

## Overview

The GDSC Slack App is a web application built using React for the frontend and a backend of your choice. This app aims to provide a seamless integration with Slack, allowing users to interact with Slack functionalities through a user-friendly web interface.

## Features

- **Landing Page**: Introduction and overview of the app.
- **Sign In**: Users can sign in using their Slack credentials.
- **Sign Up**: New users can register for the app.

## Tech Stack

- **Frontend**: React, Axios
- **Backend**: Node.js with Express
- **Authentication**: OAuth 2.0 for Slack

## Installation

### Prerequisites

- Node.js
- npm (or yarn)
- Slack API credentials (Client ID, Client Secret, etc.)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone repoURL
   cd gdsc-slack-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your backend URL:
   ```env
   REACT_APP_API_BASE_URL=http://your-backend-url/api
   ```

4. Start the frontend server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory (if it's a separate folder):
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add your Slack API credentials:
   ```env
   SLACK_CLIENT_ID=your-slack-client-id
   SLACK_CLIENT_SECRET=your-slack-client-secret
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

## Usage

- Open your browser and navigate to `http://localhost:3000` to access the app.
- Use the Sign In and Sign Up pages to interact with the Slack app.

## Project Structure

```
gdsc-slack-app/
├── public/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx
│   │   ├── SignInPage.jsx
│   │   └── SignUpPage.jsx
│   ├── App.jsx
│   ├── index.js
│   └── ...
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   └── ...
│   ├── server.js
│   ├── .env
│   └── ...
├── .env
├── package.json
├── README.md
└── ...
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

![alt text](<Landing Page.jpg>)
![alt text](<Sign-in page.jpg>)
![alt text](<Desktop - 5.jpg>)
![alt text](<Desktop - 4.jpg>)
![alt text](<Server page.jpg>)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Google Developer Student Clubs (GDSC)
- Slack API documentation

```
