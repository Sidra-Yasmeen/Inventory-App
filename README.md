# Inventory Management System (React + Node.js + MySQL)

This is a starter full-stack Inventory Management System with advanced features:
- User authentication (JWT)
- Products CRUD (SKU, category, price, quantity, supplier)
- Sales & Purchases (which update product stock)
- Low-stock alerts
- CSV export for products
- Basic reports endpoint (monthly sales, total stock value)

## Quick Local Setup
1. Create MySQL database (e.g., inventory_db) and run SQL in `backend/schema.sql`.
2. Backend:
   - cd backend
   - copy .env.example to .env and set DB and JWT_SECRET
   - npm install
   - npm run dev
3. Frontend:
   - cd frontend
   - npm install
   - npm start
