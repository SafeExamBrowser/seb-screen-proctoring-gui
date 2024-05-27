import express, {Router} from 'express';
import * as groupController from '../controllers/group.controller';
import * as screenshotDataController from '../controllers/screenshot-data.controller';
import * as searchController from '../controllers/search.controller';
import * as userAccountController from '../controllers/user-account.controller';
import * as settingsController from '../controllers/settings.controller';
import * as authorizationAdditional from '../middleware/authorizationAdditional';

const router: Router = express.Router();

router.get("/settings", settingsController.getSettings)

router.get("/group", groupController.getGroups);
router.get("/group/:uuid", groupController.getGroupByUuid);

router.get("/screenshot-data/:sessionId", screenshotDataController.getScreenshotDataBySessionId);
router.get("/screenshot-data/:sessionId/:timestamp", screenshotDataController.getScreenshotDataByTimestamp);
router.get("/screenshot-timestamps/:sessionId/:timestamp/:direction", screenshotDataController.getScreenshotTimestamps);

router.get("/search/sessions/day", searchController.searchSessionsDay);
router.get("/search/sessions", searchController.searchSessions);
router.get("/search/screenshots", searchController.searchScreenshots);
router.get("/search/timeline/:sessionId", searchController.searchTimeline);

router.get("/useraccount/me", userAccountController.getPersonalUserAccount)
router.get("/useraccount/:accountId", userAccountController.getUserAccountById)
router.get("/useraccount", userAccountController.getUserAccounts)
router.post("/useraccount/register", authorizationAdditional.isUserAccountOperationAllowed, userAccountController.registerUserAccount)
router.post("/useraccount/changePassword", authorizationAdditional.isUserAccountOperationAllowed, userAccountController.changePassword)
router.post("/useraccount/activate/:accountId", authorizationAdditional.isUserAccountOperationAllowed, userAccountController.activateUserAccount)
router.post("/useraccount/deactivate/:accountId", authorizationAdditional.isUserAccountOperationAllowed, userAccountController.deactivateUserAccount)

export default router;