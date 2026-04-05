import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { initializeFirebase } from "./config/firebase";
import openApiSpec from "./docs/openapi.json";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import analyticsRouter from "./routes/analyticsRoutes";
import healthRouter from "./routes/healthRoutes";
import matchRouter from "./routes/matchRoutes";
import playerRouter from "./routes/playerRoutes";
import rankingRouter from "./routes/rankingRoutes";

dotenv.config();
initializeFirebase();

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/health", healthRouter);
app.use("/api/v1/players", playerRouter);
app.use("/api/v1/matches", matchRouter);
app.use("/api/v1/rankings", rankingRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
