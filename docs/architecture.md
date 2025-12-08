# System Architecture – Retail Sales Management System

## 1. Overview

The Retail Sales Management System follows a simple and scalable **client–server architecture**.  
The backend is responsible for loading, processing, and serving sales data through REST APIs, while the frontend handles user interaction, visualization, and state management.  
Both layers are completely decoupled and communicate only via HTTP APIs.

---

## 2. High-Level Architecture

┌────────────────────┐
│ React Frontend │
│ (Vite + React) │
└─────────▲──────────┘
│ HTTP (REST API)
▼
┌────────────────────┐
│ Node.js Backend │
│ (Express Server) │
└─────────▲──────────┘
│
▼
┌────────────────────┐
│ Sales Dataset │
│ (CSV File) │
└────────────────────┘


---

## 3. Backend Architecture

### 3.1 Responsibility

The backend is responsible for:
- Loading the sales dataset from a CSV file at startup
- Exposing REST APIs for sales data
- Applying search, filters, sorting, and pagination
- Returning structured JSON responses to the frontend

---

### 3.2 Backend Folder Structure



backend/src/
├── controllers/
│ └── salesController.js
├── routes/
│ └── salesRoutes.js
├── services/
│ └── salesService.js
├── utils/
│ └── dataLoader.js
├── data/
│ └── sales.csv
└── index.js


---

### 3.3 Backend Flow

1. On server start, `dataLoader.js` reads **sales.csv** and loads data into memory.
2. API requests arrive through Express routes defined in `salesRoutes.js`.
3. The controller (`salesController.js`) parses query parameters.
4. Business logic is handled in `salesService.js`, which:
   - Applies search
   - Applies filters
   - Applies sorting
   - Applies pagination
5. The final result is returned as JSON to the frontend.

---

### 3.4 Backend Design Principles

- Clear separation of concerns  
- Controllers handle request/response only  
- Services handle business logic  
- Utilities handle data loading  
- Stateless APIs for reliability and scalability  

---

## 4. Frontend Architecture

### 4.1 Responsibility

The frontend is responsible for:
- Rendering the user interface
- Calling backend APIs
- Managing UI state (search, filters, sorting, pagination)
- Displaying tabular sales data efficiently

---

### 4.2 Frontend Folder Structure



frontend/src/
├── components/
│ ├── SearchBar.jsx
│ ├── FiltersPanel.jsx
│ ├── SortDropdown.jsx
│ ├── SalesTable.jsx
│ └── Pagination.jsx
├── services/
│ └── api.js
├── styles/
│ └── app.css
├── App.jsx
└── main.jsx


---

### 4.3 Frontend Flow

1. React app loads and renders `App.jsx`.
2. `api.js` fetches paginated sales data from the backend.
3. UI components emit user actions:
   - Search input
   - Filter selection
   - Sort changes
   - Page navigation
4. State updates trigger API calls with query parameters.
5. Updated results are rendered in `SalesTable`.

---

### 4.4 Frontend Design Principles

- Component-based architecture
- Single source of truth for UI state
- Stateless UI components where possible
- Separation between UI and API logic

---

## 5. API Communication

- Frontend communicates with backend via REST APIs.
- All filtering, sorting, pagination, and searching are handled on the backend.
- Frontend only passes query parameters and renders results.

Example API call:



GET /api/sales?page=1&pageSize=10&search=Neha&region=East&sortBy=date


---

## 6. Scalability Considerations

- Backend logic is modular and can be moved to a database layer later.
- In-memory dataset can be replaced with SQL/NoSQL storage without changing APIs.
- Frontend can scale independently and be deployed as a static site.
- Stateless API design enables horizontal scaling.

---

## 7. Deployment Architecture

- Backend is deployed as a **Node.js Web Service** (Render).
- Frontend is deployed as a **Static Site** (Netlify or Vercel).
- Frontend connects to backend using a deployed API base URL.
- Both services are independently deployable.

---

## 8. Summary

This architecture ensures clean separation between frontend and backend, maintainability, and scalability.  
The system is structured to meet real-world full-stack application standards while remaining simple and easy to extend.
