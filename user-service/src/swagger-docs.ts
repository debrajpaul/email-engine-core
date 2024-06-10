import swaggerJsdoc from "swagger-jsdoc";

var options = {
    swaggerDefinition: {
        swagger: "2.0",
        info: {
            title: "User Service", // Title (required)
            version: "1.0.0", // Version (required)
            description: "Manages user accounts and authentication.",
            contact: {
                name: "debraj paul",
                url: "https://www.linkedin.com/in/debraj-paul/"
            }
        }
    },
    apis: ["./src/controllers/*.ts"] // Path to the API docs
};

// Initialize swagger-jsdoc ->  validated swagger spec in json format
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;