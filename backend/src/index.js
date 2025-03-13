// import express from "express";
// import dotenv from "dotenv";
// import userRoutes from "./routes/userRoutes.js";
// import relationshipRoutes from "./routes/relationshipRoutes.js";
// import { swaggerUiMiddleware, swaggerUiHandler } from "./swagger.js"; // ✅ Ensure .js extension
// // import loanRoutes from "./routes/loanRoutes.js";
// const loanRoutes = require("./routes/loanRoutes.js");

// import rentalRouter from "./routes/rentalRoutes.js"
// // import itemRoutes from "./routes/itemRoutes.js";
// import itemRoutes from "./routes/itemRoutes.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(express.json());

// // Routes
// app.use("/api/auth", userRoutes);
// app.use("/api/item", itemRoutes);
// app.use("/api/relationship", relationshipRoutes);
// app.use("/api/loans", loanRoutes)
// app.use("/api/rental", rentalRouter);
// // Swagger Documentation
// app.use("/api-docs", swaggerUiMiddleware, swaggerUiHandler);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
// });


import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import relationshipRoutes from "./routes/relationshipRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import rentalRouter from "./routes/rentalRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import billsRouter from "./routes/billsRoute.js";
import { swaggerUiMiddleware, swaggerUiHandler } from "./swagger.js"; // ✅ Ensure .js extension

dotenv.config();

const app = express();
// const PORT = process.env.PORT || "https://sharetrack-backend.onrender.com";
const PORT="https://sharetrack-backend.onrender.com"
// app.use(cors({
//   origin: "*", // Allow all origins (you can restrict it to Next.js domain later)
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));
// // Middleware
// app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use(cors());


// Routes
app.use("/api/auth", userRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/relationship", relationshipRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/rental", rentalRouter);
app.use("/api/admin",adminRoutes);
app.use('/api/bills', billsRouter);

// Swagger Documentation
app.use("/api-docs", swaggerUiMiddleware, swaggerUiHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
