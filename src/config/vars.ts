process.loadEnvFile();
const port = process.env.PORT

export const { PORT = "8001", URL_APP_DEV = "http://localhost" } = process.env;
