import {config as configDotenv} from 'dotenv'
import {resolve} from 'path'

const env = process.env.NODE_ENV?.trim();

if (env === "dev" || !env) {
    console.log(">> Environment is 'development'")
    configDotenv({
      path: resolve(__dirname, "..", "..", ".env")
    })
} else if (env === "prod") {
    console.log(">> Environment is 'production'")
    configDotenv({
        path: resolve(__dirname, "..", "..", ".env.prod")
    })
}