import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import authorizationRoutes from "./routes/authorization.routes";
import adminProctorRoutes from "./routes/admin-proctor.routes";
import {LOG} from "./logging/logger";
import {apiRequestLogger} from "./logging/api-request-logger";
import {corsOptions} from "./config/cors-config";

const app: Express = express();
dotenv.config();

const port: string = process.env.SERVER_PORT;
const path: string = __dirname + "/views/";

LOG.info("env mode: " + process.env.NODE_ENV);

if(process.env.NODE_ENV === "dev"){
  app.use(cors(corsOptions))
}
app.use(express.static(path));
app.use(bodyParser.json());
app.use(apiRequestLogger);
app.use(authorizationRoutes);
app.use(adminProctorRoutes);


app.get("/", (req: Request, res: Response) => {
  res.sendFile(path + "index.html");
});

app.listen(port, () => {
  LOG.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});