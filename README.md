# Retail Sales Management System

## Overview
The Retail Sales Management System is a full-stack web application developed to manage and explore large retail sales datasets. The application supports searching, filtering, sorting, and pagination, ensuring efficient performance even when working with large CSV files.

This project was created as part of an internship assignment to demonstrate practical skills in backend API development, frontend UI implementation, and performance optimization.

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

## Features

### Search
- Search by customer name
- Search by phone number
- Case-insensitive search

### Filters
- Region (multi-select)
- Gender (multi-select)
- Product Category (multi-select)
- Payment Method (multi-select)
- Multiple filters can be applied simultaneously

### Sorting
- Date (Newest to Oldest)
- Date (Oldest to Newest)
- Quantity (High to Low)
- Quantity (Low to High)
- Customer Name (A–Z and Z–A)

### Pagination
- Server-side pagination
- Default page size: 10 records per page
- Efficient navigation for large datasets

## Project Structure

TRUSTATE ASS/
└── root/
    ├── backend/
    │   ├── src/
    │   │   ├── controllers/
    │   │   ├── services/
    │   │   ├── routes/
    │   │   ├── utils/
    │   │   ├── data/
    │   │   └── index.js
    │   ├── package.json
    │   └── README.md
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── services/
    │   │   ├── styles/
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── index.html
    │   ├── package.json
    │   └── README.md

## API Details

### Base URL
http://localhost:4000/api

### Sales Endpoint
GET /sales

### Query Parameters
- page: Page number
- pageSize: Number of records per page
- search: Customer name or phone number
- region: Comma-separated list of regions
- gender: Comma-separated list of genders
- category: Product category
- paymentMethod: Payment method
- sortBy: date | quantity | customer
- sortOrder: asc | desc

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory
2. Install dependencies
3. Start the server

Commands:
npm install
npm run dev

Backend will run at:
http://localhost:4000

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies
3. Start the development server

Commands:
npm install
npm run dev

Frontend will run at:
http://localhost:5173

## Architecture Overview

### Backend
- Controllers handle incoming HTTP requests
- Services contain business logic for filtering, sorting, and pagination
- Utilities manage CSV loading and preprocessing
- CSV data is loaded once at startup for better performance

### Frontend
- Component-based React architecture
- Clear separation between UI, API logic, and styling
- Efficient state updates using React hooks

## Performance Considerations
- Server-side pagination to limit data transfer
- Optimized filtering and sorting logic
- Reduced unnecessary re-renders in frontend

## Notes
- Designed to handle large datasets
- Easily extendable with charts, analytics, and exports
- Clean and maintainable code structure

## Author
Neha

## Assignment Status
- Backend API completed
- Frontend UI completed
- Search implemented
- Filters implemented
- Sorting implemented
- Pagination implemented
