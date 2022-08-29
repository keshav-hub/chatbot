import express from 'express';
import { trainModel,instantiateDemoBot, instantiateModel, predictReply } from '../controllers/Model-controller.js';

const router = express.Router();

// router.post('/instantiate', instantiateModel);
router.get('/train/:id', trainModel);
router.get('/instantiateDemoBot/:id', instantiateDemoBot);
router.get('/instantiate/:id', instantiateModel);
router.post('/predict', predictReply);

export default router;
