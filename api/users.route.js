import express from 'express';
import UsersCtrl from './users.controller.js';

const router = express.Router();


function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }

    next();
}

router.route('/id').get(isAuthenticated, UsersCtrl.azureGetId);
router.route('/id/find').get(UsersCtrl.apiGetUserById);
router.route('/profile').get(isAuthenticated, UsersCtrl.azureGetProfile);

export default router;
