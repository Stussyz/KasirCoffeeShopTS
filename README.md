# Web App Coffee Shop Cashier
A fullstack cashier web application for a coffee shop built with React, TypeScript, Tailwind CSS, Express, and MySQL.

## Features
- Product listing
- Add to cart
- Increase and decrease quantity
- Checkout transaction
- Payment and change calculation
- Sales history
- Stock update after checkout
- Client-side and server-side validation

## Tech Stack
### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
### Backend
- Express
- TypeScript
- MySQL
- mysql2

## Project Structure
kasirTS/frontend/
kasirTS/backend/

## How To Run:
### Frontend
cd frontend
npm install or npm -i
npm run dev
### Backend
cd backend
npm install or npm -i
npm run dev

## Note:
before running the system, please create database named 'kasir_ts' (or you can change it, make sure .env on /backend already changed too), then create the required tables:
- users
- categories
- products
- transactions
- transaction_items

## FUTURE IMPROVEMENTS:
- authentication
- dashboard
- product management
- printable recepit
- filter by category
