import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { initializeFirebase } from "./config/firebase";
import openApiSpec from "./docs/openapi.json";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import apiRouter from "./routes/apiRoutes";
import healthRouter from "./routes/healthRoutes";

dotenv.config();
initializeFirebase();

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/health", healthRouter);
app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
