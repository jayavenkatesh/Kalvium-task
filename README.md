# PDF Broadcast Application

This is a real-time PDF broadcast application built using React for the frontend and a WebSocket server for the backend.

## Features

- Sender can create a unique room ID and broadcast PDF files to connected receivers
- Receivers can join a room by entering the room ID and view the broadcasted PDF file
- Real-time PDF file updates are displayed in the receiver's UI without the need to refresh the page

## Technologies Used

- **Frontend**:
  - React
  - react-pdf
  - uuid
- **Backend**:
  - Node.js
  - WebSocket (ws)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jayavenkatesh/kalvium-task
    cd kalvium-task
2.Install Dependencies:
    
# Install backend dependencies
    cd backend
    npm install
  # Install frontend dependencies
  
     cd ../frontend
    npm install

3. Run the Application
    ```bash
    npm run dev


  
