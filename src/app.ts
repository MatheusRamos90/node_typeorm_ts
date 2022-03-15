import "reflect-metadata"
import "./config/Environment"
import express from "express"
import swaggerUi from "swagger-ui-express"
import "./database/index"
import { routes } from "./routes"
import swaggerDocs from "./swagger.json"
import { errorHandler } from "./config/ErrorHandler"

const app = express()

app.use(express.json())
app.use(routes)
app.use(errorHandler)
    
// ** Swagger Configuration **
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

export { app }