export default function tokenToUID(admin) {
    return function (req, res, next) {
        const token = req.get('AuthToken');
        if (token) {
            admin.auth().verifyIdToken(token).then(function (decodedToken) {
                let uid = decodedToken.uid;
                req.query.userId = uid;
                next();
            }).catch(function (error) {
                // Handle error
            });
        }
    }
}