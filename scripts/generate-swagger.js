// Script to generate swagger.json and openapi.json from src/config/swagger.js
const fs = require("fs");
const path = require("path");
const { swaggerDocument } = require("../src/config/swagger");

const rootDir = path.join(__dirname, "..");
const swaggerJsonPath = path.join(rootDir, "swagger.json");
const openapiJsonPath = path.join(rootDir, "openapi.json");

const jsonString = JSON.stringify(swaggerDocument, null, 2);

fs.writeFileSync(swaggerJsonPath, jsonString);
fs.writeFileSync(openapiJsonPath, jsonString);

console.log(" OpenAPI Schema successfully generated:");
console.log(` - ${swaggerJsonPath}`);
console.log(` - ${openapiJsonPath}`);
