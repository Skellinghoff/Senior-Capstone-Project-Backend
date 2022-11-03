import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let savedMarkers

export default class SavedMarkersDAO {
    static async injectDB(conn) {
        if (savedMarkers) {
            return
        }
        try {
            savedMarkers = await conn.db(process.env.MYTECHMAP_NS).collection("savedMarkers")
        } catch (e) {
            console.error(`Unable to establish collection handles in SavedMarkersDAO: ${e}`)
        }
    }

    static async addSavedMarker(userId, markerId, date) {
        try {
            const savedMarkerDoc = {
                user_id: ObjectId(userId),
                date: date,
                marker_id: ObjectId(markerId),
            }

            return await savedMarkers.updateOne(
                {
                    user_id: ObjectId(userId),
                    marker_id: ObjectId(markerId)
                },
                { $setOnInsert: savedMarkerDoc },
                { upsert: true }
            );
        } catch (e) {
            console.error(`Unable to save marker: ${e}`)
            return { error: e }
        }
    }

    static async deleteSavedMarker(markerId, userId) {

        try {
            const deleteResponse = await savedMarkers.deleteOne({
                "user_id": ObjectId(userId),
                "marker_id": ObjectId(markerId),
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete marker: ${e}`)
            return { error: e }
        }
    }

}