import express, {Router} from 'express';
import * as groupController from '../controllers/group.controller';
import * as sessionController from '../controllers/session.controller';
import * as searchController from '../controllers/search.controller';
import * as userAccountController from '../controllers/user-account.controller';
import * as authorizationAdditional from '../middleware/authorizationAdditional';

const router: Router = express.Router();

router.get("/group", groupController.getGroups);
router.get("/group/:uuid", groupController.getGroupByUuid);

router.get("/session/:sessionId", sessionController.getSessionBySessionId);
router.get("/session/:sessionId/:timestamp", sessionController.getSessionByTimestamp);

router.get("/search/sessions", searchController.searchSessions);
router.get("/search/screenshots", searchController.searchScreenshots);
router.get("/search/timeline/:sessionId", searchController.searchTimeline);

router.get("/useraccount/me", userAccountController.getPersonalUserAccount)
router.get("/useraccount/:accountId", userAccountController.getUserAccountById)
router.get("/useraccount", userAccountController.getUserAccounts)
router.post("/useraccount/register", userAccountController.registerUserAccount)
router.post("/useraccount/activate/:accountId", authorizationAdditional.isUserAccountOperationAllowed, userAccountController.activateUserAccount)
router.post("/useraccount/deactivate/:accountId", userAccountController.deactivateUserAccount)


export default router;