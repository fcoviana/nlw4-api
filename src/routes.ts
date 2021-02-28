import { Router } from 'express';
import UserController from './controllers/UserController';
import SurveysController from './controllers/SurveysController';
import SendMailController from './controllers/SendMailController';
import AnswerController from './controllers/AnswerController';
import NpsController from './controllers/NpsController';

const router = Router();

router.post('/api/users', UserController.create);
router.post('/api/surveys', SurveysController.create);
router.get('/api/surveys', SurveysController.show);
router.post('/api/sendMail', SendMailController.execute);
router.get('/api/answers/:value', AnswerController.execute);
router.get('/api/nps/:survey_id', NpsController.execute);

router.get('/api/users', (request, response) => {
  return response.send().json({ da: 'sdsd' });
});

export default router;
