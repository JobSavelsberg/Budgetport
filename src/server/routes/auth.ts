export default function tokenToUID(admin) {
    return function (req, res, next) {
        admin.auth().verifyIdToken(req.get('AuthToken')).then(function (decodedToken) {
            let uid = decodedToken.uid;
            req.query.userId = uid;
            next();
        }).catch(function (error) {
            // Handle error
        });
    }
}