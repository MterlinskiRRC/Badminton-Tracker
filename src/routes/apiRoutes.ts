import { Router } from "express";
import analyticsRouter from "./analyticsRoutes";
import matchRouter from "./matchRoutes";
import playerRouter from "./playerRoutes";
import rankingRouter from "./rankingRoutes";

const apiRouter: Router = Router();

apiRouter.use("/players", playerRouter);
apiRouter.use("/matches", matchRouter);
apiRouter.use("/rankings", rankingRouter);
apiRouter.use("/analytics", analyticsRouter);

export default apiRouter;
