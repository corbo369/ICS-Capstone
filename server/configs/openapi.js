/**
 * @file Openapi configuration file
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports swaggerJSDoc Application route documentation
 */

// Import libraries
import swaggerJSDoc from "swagger-jsdoc";

// Obtains openapi host, or returns localhost if not found
function url() {
  if (process.env.OPENAPI_HOST) {
    return process.env.OPENAPI_HOST;
  } else {
    const port = process.env.PORT || "3000";
    return `http://localhost:${port}`;
  }
}

// Openapi options configuration
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "restful-api",
      version: "0.0.1",
      description: "restful-api",
    },
    servers: [
      {
        url: url(),
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", "./routes/api/v1/*.js"],
};

export default swaggerJSDoc(options);
