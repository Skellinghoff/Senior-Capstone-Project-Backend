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

    static async getUserById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: 'savedMarkers',
                        let: {
                            id: '$_id',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$user_id', '$$id'],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: 'savedMarkers',
                    },
                },
                {
                    $addFields: {
                        savedMarkers: '$savedMarkers',
                    },
                },
            ];
            return await users.aggregate(pipeline).next();
        } catch (error) {
            console.error(`Something went wrong in getUserById: ${error}`);
            throw error;
        }
    }
}
