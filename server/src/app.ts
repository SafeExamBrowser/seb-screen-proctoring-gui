import express, {Express, Request, Response} from 'express';
import dotenv from "dotenv";
import cors from "cors";

import authorizationRoutes from './routes/authorization.routes';
import bodyParser from 'body-parser';

const app: Express = express();

const corsOptions: object = {
  origin: 'http://localhost:8080',
  allowedHeaders: 'Content-Type',
  methods: 'GET, POST',
  credentials: true,
}

//export into conf
const port: number = 3000;
const path: string = __dirname + '/views/';
dotenv.config();
/////////////

app.use(cors(corsOptions))
app.use(express.static(path));
app.use(bodyParser.json());
app.use(authorizationRoutes);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path + "index.html");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});