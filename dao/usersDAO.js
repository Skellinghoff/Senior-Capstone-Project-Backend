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
                email: user.preferred_username,
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

    // get user by username and use the users favorites array to get the favorited markers from the markers collection and use the users registered array to get the registered markers from the markers collection
    // return the user and the favorited and registered marker
    static async getUserByUsername(username) {
        try {
            const pipeline = [
                {
                    $match: {
                        username: username,
                    },
                },
                {
                    $lookup: {
                        from: 'markers',
                        let: {
                            favorites: '$favorites',
                            registered: '$registered',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$favorites'],
                                    },
                                },
                            },
                        ],
                        as: 'favorites',
                    },
                },
                {
                    $lookup: {
                        from: 'markers',
                        let: {
                            favorites: '$favorites',
                            registered: '$registered',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$registered'],
                                    },
                                },
                            },
                        ],
                        as: 'registered',
                    },
                },
            ];
            return await users.aggregate(pipeline).next();
        } catch (err) {
            console.error(`Unable to get user: ${err}`);
            return { error: err };
        }
    }

    static async addRegisteredMarker(userId, markerId) {
        try {
            return await users.updateOne(
                { email: userId },
                { $addToSet: { registered: markerId } }
            );
        } catch (err) {
            console.error(`Unable to add registered marker: ${err}`);
            return { error: err };
        }
    }

    static async deleteRegisteredMarker(markerId, userId) {
        try {
            return await users.updateOne(
                { email: userId },
                { $pull: { registered: markerId } }
            );
        } catch (err) {
            console.error(`Unable to delete registered marker: ${err}`);
            return { error: err };
        }
    }

    static async addFavoriteMarker(userId, markerId) {
        try {
            return await users.updateOne(
                { email: userId },
                { $addToSet: { favorites: markerId } }
            );
        } catch (err) {
            console.error(`Unable to add favorite marker: ${err}`);
            return { error: err };
        }
    }

    static async deleteFavoriteMarker(markerId, userId) {
        try {
            return await users.updateOne(
                { email: userId },
                { $pull: { favorites: markerId } }
            );
        } catch (err) {
            console.error(`Unable to delete favorite marker: ${err}`);
            return { error: err };
        }
    }
}
