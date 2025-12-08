# Retail Sales Management System

## Overview
The **Retail Sales Management System** is a full-stack web application built to efficiently manage and explore large retail sales datasets.  
It supports **searching, filtering, sorting, and pagination**, ensuring smooth performance even when working with large CSV files.

This project was developed as part of an **internship assignment** to demonstrate practical skills in:
- Backend API development
- Frontend UI implementation
- Performance optimization for large datasets

---

## Tech Stack

### Backend
- Node.js
- Express.js
- CSV file processing
- Layered architecture (Controller, Service, Utils)

### Frontend
- React (Vite)
- JavaScript (ES6+)
- Fetch API
- CSS for styling

---

## Features

### Search
- Search by customer name
- Search by phone number
- Case-insensitive search

### Filters
- Region (multi-select)
- Gender (multi-select)
- Product category (multi-select)
- Payment method (multi-select)
- Multiple filters can be applied simultaneously

### Sorting
- Date (Newest → Oldest)
- Date (Oldest → Newest)
- Quantity (High → Low)
- Quantity (Low → High)
- Customer name (A–Z, Z–A)

### Pagination
- Server-side pagination
- Default page size: **10 records per page**
- Efficient navigation for large datasets

---

## Project Structure

root/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── routes/
│ │ ├── utils/
│ │ ├── data/
│ │ └── index.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── services/
│ │ ├── styles/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.html
│ └── package.json
│
├── docs/
│ └── architecture.md
│
└── README.md

yaml
Copy code

---

## API Details

### Base URL
http://localhost:4000/api

shell
Copy code

### Sales Endpoint
GET /sales

yaml
Copy code

### Query Parameters
| Parameter | Description |
|--------|------------|
| page | Page number |
| pageSize | Number of records per page |
| search | Customer name or phone number |
| region | Comma-separated list of regions |
| gender | Comma-separated list of genders |
| category | Product category |
| paymentMethod | Payment method |
| sortBy | `date` \| `quantity` \| `customer` |
| sortOrder | `asc` \| `desc` |

---

## Dataset

This project uses a **large retail sales dataset**, which is **not included in this repository** due to GitHub’s 100 MB file size limitation.

### Download Link
👉 **[https://drive.google.com/file/d/1tzbyuxBmrBwMSXbL22r33FUMtO0V_lxb/view?usp=sharing]**

### Using the Dataset Locally
After downloading the dataset, place the file at:
backend/src/data/sales.csv

yaml
Copy code

> The backend automatically loads this file when the server starts.  
> The dataset is excluded from version control using `.gitignore`.

---

## Setup Instructions

### Backend Setup
1. Navigate to the backend folder:
cd backend

markdown
Copy code
2. Install dependencies:
npm install

markdown
Copy code
3. Start the server:
npm run dev

yaml
Copy code

Backend runs at:
http://localhost:4000

yaml
Copy code

---

### Frontend Setup
1. Navigate to the frontend folder:
cd frontend

markdown
Copy code
2. Install dependencies:
npm install

markdown
Copy code
3. Start the development server:
npm run dev

yaml
Copy code

Frontend runs at:
http://localhost:5173

yaml
Copy code

---

## Architecture Overview

### Backend
- Controllers handle incoming HTTP requests
- Services contain business logic for filtering, sorting, and pagination
- Utilities manage CSV loading and preprocessing
- CSV data is loaded once at startup for better performance

### Frontend
- Component-based React architecture
- Clear separation between UI, API logic, and styling
- Efficient state management using React hooks

---

## Performance Considerations
- Server-side pagination to reduce data transfer
- Optimized filtering and sorting logic
- Reduced unnecessary re-renders on the frontend
