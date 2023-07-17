import express, {Router} from 'express';

import * as adminProctorController from '../controllers/admin-proctor.controller';
import * as validation from '../validation/validation';

const router: Router = express.Router();

//todo: validate headers for authorization
// router.post("/authorize", validation.authorize, authorizationController.authorize);

router.get("/group", adminProctorController.getGroups);
router.get("/group/:uuid", adminProctorController.getGroupByUuid);



export default router;