# 🛒 E-Commerce Backend (Node.js + Express + MongoDB)

An industry-level **E-Commerce RESTful API** built using **Node.js**, **Express**, and **MongoDB (Mongoose)**.  
It includes **user authentication, product management, cart, orders, reviews, Stripe payments, and address handling** — designed for scalability and real-world production use.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---
## 📋 Table of Contents
- [🚀 Overview](#-overview)
- [✨ Features](#-features)
- [⚙️ Tech Stack](#️-tech-stack)
- [📁 API Endpoints](#-api-endpoints)
- [🛠️ Installation](#️-installation)
- [🔧 Payment Integration](#-payment-integration)
- [📚 Custom Utilities](#-custom-utilities)
- [💳 Deployment](#-deployment)
- [👨‍💻 Author](#-author)

---
## 🚀 Overview

This project implements a **complete e-commerce backend system** with enterprise-grade features:
- **Scalable REST API** architecture with best practices
- **Secure authentication & authorization** system
- **Real payment processing** with Stripe integration
- **Cloud-based file management** with Cloudinary
- **Comprehensive product & order management**


Built to demonstrate **production-level backend development skills** for technical interviews and real-world applications.

---

## 🚀 Features

### 🧑‍💻 User & Auth
- JWT-based authentication with cookies  
- Role-based access (admin / user)  
- Secure password hashing using **bcrypt**  
- User registration, login, logout  

### 🛍️ Product Management
- Add, update, delete, and view products  
- Upload product images to **Cloudinary**  
- SKU uniqueness validation  
- Dynamic filters:
  - Category, brand, price, material, size, color, gender  
  - Pagination, sorting, and keyword search  
- Fetch **Best Sellers**, **Similar Products**, and **New Arrivals**

### 🛒 Cart Management
- Add, update, and delete cart items  
- Auto-calculate total price  
- Handle product variants (color, size)  
- Get user-specific cart with subtotal and total  

### 📦 Orders & Checkout
- Place orders (COD / Stripe Payment)  
- Stripe payment integration  
- Stripe webhook for payment verification  
- Automatic cart clearance after order creation  
- Order tracking (status updates: Processing, Delivered)  
- Admin endpoints for managing all user orders  

### 🏠 Address Management
- Add, update, delete, and get addresses per user  
- Set **default** address  
- Input validation via **Joi**

### ⭐ Reviews & Ratings
- Add or update product reviews  
- Average product rating auto-updates  
- Delete review (owner or admin only)  
- Fetch all reviews (per product or global)

---

## 🧱 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt |
| **Validation** | Joi |
| **Payments** | Stripe |
| **File Uploads** | Cloudinary |
| **Environment Config** | dotenv |
| **Error Handling** | Custom middleware (ApiError, ApiResponse, asyncHandler) |

---
## 📁 API Endpoints

### 👤 Authentication APIs
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| `POST` | `/api/user/register` | Register new user | Public |
| `POST` | `/api/user/login` | User login | Public |
| `POST` | `/api/user/logout` | User logout | Private |


### 🛍️ Product APIs
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| `POST` | `/api/product` | Create new product | Admin |
| `GET` | `/api/product` | Get all products (filter/search) | Public |
| `GET` | `/api/product/:id` | Get product details | Public |
| `PUT` | `/api/product/:id` | Update product | Admin |
| `DELETE` | `/api/product/:id` | Delete product | Admin |
| `GET` | `/api/product/best-seller` | Get best seller product | Public |
| `GET` | `/api/product/new-arrivals` | Get new arrivals product | Public |
| `GET` | `/api/product/similar/:id` | Get similar product | Public |


### 🛒 Cart APIs
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| `POST` | `/api/cart` | Add item to cart | Private |
| `GET` | `/api/cart` | Get user cart | Private |
| `PUT` | `/api/cart/:id` | Update cart item | Private |
| `DELETE` | `/api/cart/:id` | Remove cart item | Private |
| `DELETE` | `/api/cart` | Clear entire cart | Private |

### 💳 Order & Payment APIs
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| `POST` | `/api/orders` | Create new order | Private |
| `GET` | `/api/orders` | Get user orders | Private |
| `GET` | `/api/orders/:id` | Get order details | Private |
| `PUT` | `/api/orders/:id` | Update order status | Admin |
| `POST` | `/api/payments/webhook` | Stripe webhook handler | Public |

### 🏠 Address APIs
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| `POST` | `/api/address` | Add new address | Private |
| `GET` | `/api/address` | Get user addresses | Private |
| `PUT` | `/api/address/:id` | Update address | Private |
| `DELETE` | `/api/address/:id` | Delete address | Private |

---
## 🛠️ Installation & setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local installation or MongoDB Atlas)
- **Stripe Account** for payment processing
- **Cloudinary Account** for image management
Create a .env File
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=http://localhost:3000

###  Clone the Repository
git clone https://github.com/Alishba234/ecommerce-backend-api.git
cd ecommerce-backend

## Payment Integration
- Integrated with Stripe Checkout for secure online payments.
 Includes:
- Stripe session creation
- Webhook event listener for checkout.session.completed
- Automatic order update after successful payment

## Custom Utilities
- ApiError → centralized error handling
- ApiResponse → unified JSON structure
- asyncHandler → handles async errors gracefully

## Deployment
- Can be deployed easily on:
- Render
- Vercel
- Railway
- AWS EC2 or DigitalOcean

## Author
- Developer: Alishba
- Role: Backend Developer
- Email: your_email@example.com
- GitHub: github.com/Alishba234
- LinkedIn: linkedin.com/in/your-link

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

⭐ If you like this project, don’t forget to star the repo!