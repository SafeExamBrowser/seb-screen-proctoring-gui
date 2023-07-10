import express, {Express, Request, Response} from 'express';
import dotenv from "dotenv";
// import { ExpressValidator } from 'express-validator';

import authorizationRoutes from './routes/authorization.routes';
import bodyParser from 'body-parser';


const app: Express = express();

//export into conf
const port: number = 3000;
const path: string = __dirname + '/views/';
dotenv.config();
/////////////

app.use(express.static(path));
app.use(bodyParser.json());
app.use(authorizationRoutes);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path + "index.html");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});