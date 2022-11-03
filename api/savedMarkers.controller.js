import SavedMarkersDAO from '../dao/savedMarkersDAO.js';

export default class SavedMarkersController {
    static async apiPostSavedMarker(req, res, next) {
        try {
            const userId = req.body.user_id;
            const markerId = req.body.marker_id;
            const date = new Date()

            const ReviewResponse = await SavedMarkersDAO.addSavedMarker(
                userId,
                markerId,
                date,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteSavedMarker(req, res, next) {
        try {
            const markerId = req.body.marker_id
            const userId = req.body.user_id
            console.log(markerId)
            const reviewResponse = await SavedMarkersDAO.deleteSavedMarker(
                markerId,
                userId,
            )
            res.json(reviewResponse)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

}