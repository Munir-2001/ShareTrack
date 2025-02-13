
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

// const swaggerSpec = swaggerJsdoc(options);

// const swaggerUiMiddleware = swaggerUi.serve;
// const swaggerUiHandler = swaggerUi.setup(swaggerSpec);

// module.exports = { swaggerUiMiddleware, swaggerUiHandler };

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
        url: "http://localhost:5001", // Adjust the port if necessary
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
