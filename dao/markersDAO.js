import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;
let markers;

export default class MarkersDAO {
    static async injectDB(conn) {
        if (markers) {
            return;
        }
        try {
            markers = await conn
                .db(process.env.MYTECHMAP_NS)
                .collection('markers');
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in markersDAO: ${e}`
            );
        }
    }

    static async getMarkers({
        filters = null,
        page = 0,
        markersPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if ('_category' in filters) {
                query = { _category: { $eq: filters['_category'] } };
            } else if ('_name' in filters) {
                query = { $text: { $search: filters['_name'] } };
            } else if ('zipcode' in filters) {
                query = { 'address.zipcode': { $eq: filters['zipcode'] } };
            }
        }

        let cursor;

        try {
            cursor = await markers.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { markersList: [], totalNumMarkers: 0 };
        }

        const displayCursor = cursor
            .limit(markersPerPage)
            .skip(markersPerPage * page);

        try {
            const markersList = await displayCursor.toArray();
            const totalNumMarkers = await markers.countDocuments(query);

            return { markersList, totalNumMarkers };
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { markersList: [], totalNumMarkers: 0 };
        }
    }
    static async getMarkerByID(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: {
                            id: '$_id',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$marker_id', '$$id'],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: 'reviews',
                    },
                },
                {
                    $addFields: {
                        reviews: '$reviews',
                    },
                },
            ];
            return await markers.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in getMarkerByID: ${e}`);
            throw e;
        }
    }

    static async getCuisines() {
        let cuisines = [];
        try {
            cuisines = await markers.distinct('cuisine');
            return cuisines;
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`);
            return cuisines;
        }
    }
}
