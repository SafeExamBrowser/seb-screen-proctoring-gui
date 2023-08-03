import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import authorizationRoutes from "./routes/authorization.routes";
import adminProctorRoutes from "./routes/admin-proctor.routes";


const app: Express = express();
dotenv.config();

const port: string = process.env.SERVER_PORT;
const path: string = __dirname + "/views/";

if(process.env.NODE_ENV === "dev"){
  const corsOptions: object = {
    origin: `${process.env.DEV_SERVER_URL}:${process.env.DEV_SERVER_PORT}`,
    allowedHeaders: "Content-Type, authorization",
    methods: "GET, POST",
    credentials: true,
  }
  app.use(cors(corsOptions))
}

console.log("env mode: " + process.env.NODE_ENV);

app.use(express.static(path));
app.use(bodyParser.json());
app.use(authorizationRoutes);
app.use(adminProctorRoutes);


app.get("/", (req: Request, res: Response) => {
  res.sendFile(path + "index.html");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});