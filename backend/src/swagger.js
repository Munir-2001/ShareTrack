// import swaggerJSDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "ShareTrack API",
//       version: "1.0.0",
//       description: "API documentation for ShareTrack backend",
//     },
//     servers: [
//       {
//         url: "http://localhost:5001", // Adjust the port if necessary
//       },
//     ],
//     components: {
//       securitySchemes: {
//         BearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//     },
//   },
//   apis: ["./src/routes/*.js"], // Path to route files
// };

// const swaggerSpec = swaggerJSDoc(options);

// export const swaggerUiMiddleware = swaggerUi.serve;
// export const swaggerUiHandler = swaggerUi.setup(swaggerSpec);


import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Determine the base URL based on the environment (production or development)
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://sharetrack-backend.onrender.com/" // Replace with your actual production URL
    : "http://localhost:5001"; // Local development URL

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShareTrack API",
      version: "1.0.0",
      description: "API documentation for ShareTrack backend",
    },
    servers: [
      {
        url: baseUrl, // Dynamically set the base URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to route files
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerUiMiddleware = swaggerUi.serve;
export const swaggerUiHandler = swaggerUi.setup(swaggerSpec);