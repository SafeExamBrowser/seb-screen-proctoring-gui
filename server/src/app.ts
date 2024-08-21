import dotenv from "dotenv";
dotenv.config();

import express, {Express, Request, Response} from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authorizationRoutes from "./routes/authorization.routes";
import routes from "./routes/routes";
import {LOG} from "./logging/logger";
import {apiRequestLogger} from "./logging/api-request-logger";
import * as ENV from "./config/envConfig";

const app: Express = express();

const port: string = ENV.SERVER_PORT;
const viewPath: string = __dirname + "/views/";
const distPath: string = __dirname + "/dist/";

// Get environment mode for local dev and set CORS options
LOG.info("env mode: " + ENV.NODE_ENV);
if(ENV.NODE_ENV === "dev"){
  app.use(cors(getCorstOptions()))
  // app.use(cors())
}

app.use(express.static(viewPath));
app.use('/sps-gui', express.static(distPath));

app.use(bodyParser.json());

app.use(apiRequestLogger);
app.use(authorizationRoutes);
app.use(routes);

// Serve the index.html for the root path
app.get("/", (req: Request, res: Response) => {
  res.sendFile(viewPath + "index.html");
});

app.get("/sps-gui/*", (req: Request, res: Response) => {
  res.sendFile(distPath + "index.html");
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(viewPath + "index.html");
});

app.listen(port, () => {
  LOG.info(`⚡️[server]: Server is running at 0.0.0.0 ${port}`);
});

function getCorstOptions(): object{
  return {
    origin: `${ENV.DEV_SERVER_URL}:${ENV.DEV_SERVER_PORT}`,
    allowedHeaders: "Content-Type, authorization",
    methods: "GET, POST",
    credentials: true,
  };
}