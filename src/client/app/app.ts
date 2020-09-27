import * as db from "./db"
import firebase from "firebase";

export async function init(currentUser) {
    console.log("Initializing app");
    currentUser.getIdToken(/* forceRefresh */ true).then(async function (idToken) {
        //give session before loading db
        await db.auth(currentUser, idToken);
        await db.load();

    }).catch(function (error) {
        // Handle error
    });

}
