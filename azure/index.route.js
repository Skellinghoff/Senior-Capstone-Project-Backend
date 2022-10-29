import express from 'express';
import IndexCtrl from './index.controller.js';

const router = express.Router();

router.route('/').get(IndexCtrl.azureGetIndex);

export default router;