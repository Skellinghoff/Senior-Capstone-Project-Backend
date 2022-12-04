import fetch from '../azure/fetch.js';
import { GRAPH_ME_ENDPOINT } from '../azure/authConfig.js';
import UsersDAO from '../dao/usersDAO.js';

export default class UsersController {
    static async azureGetId(req, res, next) {
        var idTokenClaims = req.session.account.idTokenClaims;
        res.json({ idTokenClaims: idTokenClaims });
        UsersDAO.addUser(idTokenClaims);
    }
    static async azureGetProfile(req, res, next) {
        try {
            const graphResponse = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
            res.json({ profile: graphResponse });
        } catch (error) {
            next(error);
        }
    }
    static async apiGetUserByEmail(req, res, next) {
        try {
            let email = req.query.email || {};
            console.log(email);
            let user = await UsersDAO.getUserByUsername(email);
            if (!user) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            console.log(`api, ${error}`);
            res.status(500).json({ error: error });
        }
    }

    static async apiGetUserByUsername(req, res, next) {
        try {
            let username = req.params.username || {};
            console.log(username);
            let user = await UsersDAO.getUserByUsername(username);
            if (!user) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            console.log(`api, ${error}`);
            res.status(500).json({ error: error });
        }
    }

    static async apiAddRegisteredMarker(req, res, next) {
        try {
            const userId = req.body.user_id;
            const markerId = req.body.marker_id;
            const date = new Date()

            const ReviewResponse = await UsersDAO.addRegisteredMarker(
                userId,
                markerId,
                date,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiRemoveRegisteredMarker(req, res, next) {
        try {
            const markerId = req.body.marker_id
            const userId = req.body.user_id
            console.log(markerId)
            const reviewResponse = await UsersDAO.removeRegisteredMarker(
                markerId,
                userId,
            )
            res.json(reviewResponse)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiAddFavoriteMarker(req, res, next) {
        try {
            const userId = req.body.user_id;
            const markerId = req.body.marker_id;
            console.log(markerId);
            const date = new Date()
            console.log(userId, markerId, date);

            const ReviewResponse = await UsersDAO.addFavoriteMarker(
                userId,
                markerId,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiRemoveFavoriteMarker(req, res, next) {
        try {
            const markerId = req.body.marker_id
            const userId = req.body.user_id
            console.log(markerId)
            const reviewResponse = await UsersDAO.removeFavoriteMarker(
                markerId,
                userId,
            )
            res.json(reviewResponse)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

}
