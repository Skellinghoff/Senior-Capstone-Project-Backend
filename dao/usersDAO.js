import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;
let users;

export default class UsersDAO {
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn
                .db(process.env.MYTECHMAP_NS)
                .collection('users');
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in usersDAO: ${e}`
            );
        }
    }

    static async addUser(user) {
        try {
            const userDoc = {
                name: user.name,
                email: user.email,
                password: user.password,
                registerd: [],
                favorites: [],
            };
            return await users.updateOne(
                { email: user.preferred_username },
                { $setOnInsert: userDoc },
                { upsert: true }
            );
        } catch (err) {
            console.error(`Unable to add user: ${err}`);
            return { error: err };
        }
    }

    static async getUsers() {
        let cursor;
        try {
            cursor = await users.find();
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { usersList: [], totalNumUsers: 0 };
        }

        try {
            const usersList = await cursor.toArray();
            const totalNumUsers = await users.countDocuments();

            return { usersList, totalNumUsers };
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { usersList: [], totalNumUsers: 0 };
        }
    }

    // get user by username and use the users favorites array to get the favorited markers from the markers collection and use the users registered array to get the registered markers from the markers collection
    // return the user and the favorited and registered marker
    static async getUserByUsername(username) {
        console.log('username', username);
        try {
            const pipeline = [
                {
                    $match: {
                        username: username,
                    },
                },
            ];
            return await users.aggregate(pipeline).next();
        } catch (err) {
            console.error(`Unable to get user: ${err}`);
            return { error: err };
        }
    }

    // add a marker to the users favorites array
    static async addFavoriteMarker(userId, markerId) {
        try {
            return await users.updateOne(
                { id: userId },
                { $addToSet: { favorites: markerId } }
            );
        } catch (err) {
            console.error(`Unable to add favorite marker: ${err}`);
            return { error: err };
        }
    }

    // remove a marker from the users favorites array
    static async removeFavoriteMarker(userId, markerId) {
        try {
            return await users.updateOne(
                { id: userId },
                { $pull: { favorites: markerId } }
            );
        } catch (err) {
            console.error(`Unable to remove favorite marker: ${err}`);
            return { error: err };
        }
    }

    // add a marker to the users registered array
    static async addRegisteredMarker(userId, markerId) {
        try {
            return await users.updateOne(
                { id: userId },
                { $addToSet: { registered: markerId } }
            );
        } catch (err) {
            console.error(`Unable to add registered marker: ${err}`);
            return { error: err };
        }
    }

    // remove a marker from the users registered array
    static async removeRegisteredMarker(userId, markerId) {
        try {
            return await users.updateOne(
                { id: userId },
                { $pull: { registered: markerId } }
            );
        } catch (err) {
            console.error(`Unable to remove registered marker: ${err}`);
            return { error: err };
        }
    }


}
