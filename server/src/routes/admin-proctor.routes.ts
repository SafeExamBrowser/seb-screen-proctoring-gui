import express, {Router} from 'express';

import * as adminProctorGroupController from '../controllers/admin-proctor-group.controller';
import * as adminProctorSessionController from '../controllers/admin-proctor-session.controller';
import * as adminProctorSearchController from '../controllers/admin-proctor-search.controller';
import * as adminProctorUserAccountController from '../controllers/admin-proctor-user-account.controller';

import * as validation from '../validation/validation';

const router: Router = express.Router();

//todo: validate headers for authorization
// router.post("/authorize", validation.authorize, authorizationController.authorize);

router.get("/group", adminProctorGroupController.getGroups);
router.get("/group/:uuid", adminProctorGroupController.getGroupByUuid);

router.get("/session/:sessionId", adminProctorSessionController.getSessionBySessionId);
router.get("/session/:sessionId/:timestamp", adminProctorSessionController.getSessionByTimestamp);

router.get("/search/sessions", adminProctorSearchController.searchSessions);
router.get("/search/screenshots", adminProctorSearchController.searchScreenshots);
router.get("/search/timeline/:sessionId", adminProctorSearchController.searchTimeline);

router.get("/useraccount/me", adminProctorUserAccountController.getPersonalUserAccount)
router.get("/useraccount/:accountId", adminProctorUserAccountController.getUserAccountById)
router.get("/useraccount", adminProctorUserAccountController.getUserAccounts)
router.post("/useraccount/register", adminProctorUserAccountController.registerUserAccount)





export default router;