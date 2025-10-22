import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'E-Commerce REST API',
    description: `
Welcome to the **E-Commerce REST API** — a production-grade backend built to showcase secure, scalable, and real-world features.  

###  Why this project stands out
- **Industry-Level Practices**: Error handling, validation, clean architecture (routes, controllers, middleware).
- **Security First**: JWT authentication, password hashing with bcrypt, role-based access control, and security middlewares (Helmet, CORS, xss-clean).
- **Scalability**: Proper database design with one-to-many relationships (Users → Orders → Items).
- **Payment Integration**: Stripe payment gateway with webhook verification for secure order processing.
- **Cloud-Ready**: Image uploads with Cloudinary, storing secure URLs in the database.
- **Comprehensive Documentation**: All endpoints are tested, documented, and interactive with Swagger UI.

###  Features You Can Test
- **Authentication**: Register/login users, role-based access for customers/admins.
- **Products**: Add, update, search, filter, and manage product inventory.
- **Cart & Checkout**: Add/remove items, place orders, and simulate checkout flow.
- **Orders**: Track order history, update order status, and manage items.
- **Admin Panel**: APIs for managing users, products, and orders at scale.

###  Recruiter’s Note
This project demonstrates my ability to build **secure, scalable backends with real-world integrations** (Stripe, Cloudinary) and document them for collaboration.  
Feel free to register a user, place an order, or test the admin panel APIs to experience the workflow.  

 **Goal:** Apply these skills in building high-performance backend systems in a professional environment.
    `,
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './src/swagger/swagger-output.json';
const endpointsFiles = ['./src/server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
