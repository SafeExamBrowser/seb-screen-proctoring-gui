import express, {Router} from 'express';

import * as authorizationController from '../controllers/authorization.controller';
import * as validation from '../validation/validation';

const router: Router = express.Router();

router.post("/authorize", validation.authorize, authorizationController.authorize);
router.post("/refresh", authorizationController.refresh);
router.post("/useraccount/logLogin", authorizationController.logLogin);
router.post("/useraccount/logLogout", authorizationController.logLogout)

export default router;