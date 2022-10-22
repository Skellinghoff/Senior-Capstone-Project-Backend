import express from 'express';
import MarkersCtrl from './markers.controller.js';

const router = express.Router();

router.route('/').get(MarkersCtrl.apiGetMarkers);
router.route('/id/:id').get(MarkersCtrl.apiGetMarkerById);


export default router;
