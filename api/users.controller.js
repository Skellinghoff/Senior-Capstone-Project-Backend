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
    static async apiGetUserById(req, res, next) {
        try {
            let id = req.params.id || {};
            let user = await UsersDAO.getUserById(id);
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
}
