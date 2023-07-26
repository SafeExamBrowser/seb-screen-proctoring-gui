import express, {Router} from 'express';

import * as authorizationController from '../controllers/authorization.controller';
import * as validation from '../validation/validation';

const router: Router = express.Router();

router.post("/authorize", validation.authorize, authorizationController.authorize);
router.post("/refresh", authorizationController.refresh);


export default router;