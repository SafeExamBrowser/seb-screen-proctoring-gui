import express, {Router} from 'express';
import bodyParser from 'body-parser';

import * as authorizationController from '../controllers/authorization.controller';
import * as validation from '../validation/validation';

const router: Router = express.Router();

//router.post("/authorize", body("username", "password").notEmpty(), bodyParser.json(), authorizationController.authorize);


router.post("/authorize", validation.authorize, authorizationController.authorize);

export default router;