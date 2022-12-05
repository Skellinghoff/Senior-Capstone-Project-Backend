import express from 'express';
import UsersCtrl from './users.controller.js';

const router = express.Router();

router.route('/').get(UsersCtrl.apiGetUsers);
router.route('/username/:username').get(UsersCtrl.apiGetUserByUsername);
router.route('/addRegisteredMarker').post(UsersCtrl.apiAddRegisteredMarker);
router.route('/removeRegisteredMarker').post(UsersCtrl.apiRemoveRegisteredMarker);
router.route('/addFavoriteMarker').post(UsersCtrl.apiAddFavoriteMarker);
router.route('/removeFavoriteMarker').post(UsersCtrl.apiRemoveFavoriteMarker);

export default router;
