import { Router } from 'express';
import UserController from './controllers/UserController';
import SurveysController from './controllers/SurveysController';

const router = Router();

router.post('/api/users', UserController.create);
router.post('/api/surveys', SurveysController.create);
router.get('/api/surveys', SurveysController.show);

router.get('/api/users', (request, response) => {
  return response.send().json({ da: 'sdsd' });
});

export default router;
