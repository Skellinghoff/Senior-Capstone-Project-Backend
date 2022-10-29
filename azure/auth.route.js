import express from 'express';
import AuthCtrl from './auth.controller.js';

const router = express.Router();

router.route('/signin').get(AuthCtrl.azureGetSignin);
router.route('/acquireToken').get(AuthCtrl.azureGetAcquireToken);
router.route('/redirect').post(AuthCtrl.azurePostRedirect);
router.route('/signout').get(AuthCtrl.azureGetSignout);

export default router;
