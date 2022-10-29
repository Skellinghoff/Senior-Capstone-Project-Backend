export default class IndexController {
    static azureGetIndex(req, res, next) {
        console.log('azureGetIndex');
        res.json({
            title: 'MSAL Node & Express Web App',
            isAuthenticated: req.session.isAuthenticated,
            username: req.session.account?.username,
        });
    }
}