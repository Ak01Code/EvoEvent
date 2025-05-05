EvoEvent
EvoEvent is a full-stack event management application built using React (with ShadCN UI) for the frontend and NestJS with MongoDB for the backend. The application allows users to register, log in, and manage events, with features like event creation, editing, deletion, search, filtering, and different viewing modes.

🏗️ Tech Stack
Frontend:
-React.js (with Vite)

-ShadCN UI

-React Router

-Axios (for API calls)

-JWT Authentication

Backend:
-NestJS

-MongoDB (Mongoose)

-JWT Authentication

-REST API

-Pagination, Filtering, and Searching.

🚀 Features

✅ User Authentication:
Users can register and log in with secure authentication using JWT tokens.

Authentication state is managed on the frontend.

Protected routes prevent unauthorized access.

✅ Events Management:
Create, Edit, Delete events.

View all events or only user-created events.

Events can be viewed in card view or list view.

✅ Search & Filter:
Search events by title.

Filter events using a dropdown.

Pagination implemented on the backend.

📌 Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/Ak01Code/EvoEvent.git

2️⃣ Backend Setup
1.Go to the backend folder:
cd backend
2.Install dependencies:
npm install
3.Start the backend server:
npm run start

3️⃣ Frontend Setup
1.Open a new terminal and go to the frontend folder:
cd frontend
2.Install dependencies:
npm install
3.Start the frontend application:
npm run dev

🔗 API Endpoints

| Method   | Endpoint      | Description                                       | Protected |
| -------- | ------------- | ------------------------------------------------- | --------- |
| `POST`   | `/register`   | Register a new user                               | No        |
| `POST`   | `/login`      | User login                                        | No        |
| `GET`    | `/events`     | Get events with pagination, filtering, and search | Yes       |
| `POST`   | `/events`     | Create a new event                                | Yes       |
| `PATCH`  | `/events/:id` | Update an existing event                          | Yes       |
| `DELETE` | `/events/:id` | Delete an event                                   | Yes       |

🔐 Protected Routes

-The /events route is protected; users must be logged in to access their events.

-JWT tokens are used for authentication in both frontend and backend.

📌 Additional Features

-Pagination: Backend handles event pagination.

-Responsive UI: Works on all screen sizes.

-Modern UI: Built with ShadCN UI for a sleek design.

📧 Contact
For any queries or issues, feel free to raise an issue in the repository.
