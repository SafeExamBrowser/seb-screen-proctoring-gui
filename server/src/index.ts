import express, { Express, Request, Response } from 'express';

const app: Express = express();

const port: number = 3000;
const path: string = __dirname + '/views/';

app.use(express.static(path));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path + "index.html");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});