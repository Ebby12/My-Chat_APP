# Java Chat Application (Frontend)

The Java Chat Application is a frontend implementation of a real-time chat platform using React. It provides a user-friendly interface for users to communicate with each other in real-time. The frontend code is written in React and utilizes various libraries such as MUI (Material-UI) for UI components and StompJS for WebSocket communication.

## Features

- Real-time messaging: Users can send and receive messages instantly within the chat application.
- Connect to WebSocket: Users can establish a WebSocket connection to the chat server to enable real-time communication.
- Display chat history: The application displays the chat history, including the sender, timestamp, and message content.

## Prerequisites

- Node.js and npm installed on your machine.

## Installation

1. Clone the repository to your local machine   
2. Navigate to the project directory
3. Install the dependencies 
4. Start the development server
5. Access the chat application in your web browser:
   http://localhost:3000


## Backend

The frontend code connects to a backend server implemented using Spring Boot, which handles the WebSocket communication and message broadcasting. The backend server should be running at `http://localhost:8080` for the frontend to establish a WebSocket connection.

Please refer to the backend code and the provided README for instructions on running the backend server.

## Usage

1. Open the chat application in your web browser.
2. Click on the "Connect" button to establish a WebSocket connection with the backend server.
3. Once connected, you can start sending and receiving messages in real-time.
4. The chat history will be displayed in the chat window, showing the timestamp, and message content.




