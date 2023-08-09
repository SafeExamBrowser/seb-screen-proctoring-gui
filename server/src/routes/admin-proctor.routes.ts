import express, {Router} from 'express';

import * as adminProctorGroupController from '../controllers/admin-proctor-group.controller';
import * as adminProctorSessionController from '../controllers/admin-proctor-session.controller';
import * as validation from '../validation/validation';

const router: Router = express.Router();

//todo: validate headers for authorization
// router.post("/authorize", validation.authorize, authorizationController.authorize);

router.get("/group", adminProctorGroupController.getGroups);
router.get("/group/:uuid", adminProctorGroupController.getGroupByUuid);
router.get("/session/:sessionId", adminProctorSessionController.getSessionBySessionId);
router.get("/session/:sessionId/:timestamp", adminProctorSessionController.getSessionByTimestamp);

export default router;