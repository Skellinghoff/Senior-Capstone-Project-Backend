import express from 'express';
import MarkersCtrl from './markers.controller.js';
import SavedMarkersCtrl from './savedMarkers.controller.js';

const router = express.Router();

router.route('/').get(MarkersCtrl.apiGetMarkers);
router.route('/id/:id').get(MarkersCtrl.apiGetMarkerById);

router
    .route('/savedMarker')
    .post(SavedMarkersCtrl.apiPostSavedMarker)
    .delete(SavedMarkersCtrl.apiDeleteSavedMarker);

export default router;
