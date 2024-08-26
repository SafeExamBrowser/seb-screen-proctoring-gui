import dotenv from "dotenv";
dotenv.config();

import express, {Express, Request, Response} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

import authorizationRoutes from "./routes/authorization.routes";
import routes from "./routes/routes";
import {LOG} from "./logging/logger";
import {apiRequestLogger} from "./logging/api-request-logger";
import * as ENV from "./config/envConfig";

const app: Express = express();

const port: string = ENV.SERVER_PORT;
const path: string = __dirname + "/views/";

const mainIndexPath: string = path + "index.html";
const copyIndexPath: string = path + "index_copy.html";

//get environment mode for local dev and set cors options
if(ENV.NODE_ENV === "dev"){
  app.use(cors(getCorstOptions()))
}


//static files config
app.use(ENV.BASE_PATH, express.static(path));
app.use(bodyParser.json());


//middleware
app.use(apiRequestLogger);


//api routes
app.use(authorizationRoutes);
app.use(routes);


//static files routes
app.get("/", (req: Request, res: Response) => {
    res.sendFile(mainIndexPath);

});

app.get("*", (req: Request, res: Response) => {
    res.sendFile(mainIndexPath);
});

//server startup
app.listen(port, async () => {
    //reset the main index file to its original state
    //this is needed to have an empty placerholder for potential changes in the "BASE_PATH" env-var
    await resetMainIndex();

    //create a copy of the original placeholder file
    await copyBaseHTML();

    //replace the placeholder in index.html with the actual path of env.js
    await modifyBaseHTML();

    LOG.info(`⚡️[server]: Server is running at : ${port}`);
    LOG.info("env mode: " + ENV.NODE_ENV);
    LOG.info("is seb-server integrated: " + ENV.SEB_SERVER_INTEGRATED_MODE);
    LOG.info("base path: " + ENV.BASE_PATH);
    LOG.info(`screen-proctoring-server: ${ENV.PROCTOR_SERVER_URL}${ENV.PROCTOR_SERVER_PORT}`)
});


function getCorstOptions(): object{
  return {
    origin: `${ENV.DEV_SERVER_URL}:${ENV.DEV_SERVER_PORT}`,
    allowedHeaders: "Content-Type, authorization",
    methods: "GET, POST",
    credentials: true,
  };
}

//index files functions
async function resetMainIndex(){
    const file: string = fs.readFileSync(mainIndexPath, { encoding: 'utf8' });

    if(file.includes("{{SCRIPT_PATH}}")){
        return;
    }

    fs.unlink(mainIndexPath, (err) => {
        if (err) {
            throw err;
        }
    });

    renameCopyFile();
}

async function copyBaseHTML(){
    const file: string = fs.readFileSync(mainIndexPath, { encoding: 'utf8' });

    fs.writeFile(copyIndexPath, file, async (err) => {
        if (err) {
            throw err;
        }
    });
}

async function renameCopyFile(){
    fs.rename(copyIndexPath, mainIndexPath, (err) => {
        if(err){
            throw err;
        }
    });
}

async function modifyBaseHTML(){
    const file: string = fs.readFileSync(mainIndexPath, { encoding: 'utf8' });

    let scriptTag: string = `<script src="/env.js"></script>`;
    if(ENV.BASE_PATH != undefined && ENV.BASE_PATH != null && ENV.BASE_PATH != ""){
        scriptTag = `<script src="${ENV.BASE_PATH}/env.js"></script>`;
    }

    const modifiedHtml = file.replace('{{SCRIPT_PATH}}', scriptTag);

    fs.writeFile(mainIndexPath, modifiedHtml, 'utf-8', function (err) {
        if(err){
            throw err;
        } 
    });
}