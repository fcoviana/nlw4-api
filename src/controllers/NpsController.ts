import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import SurveysUsersRepository from '../repositories/SurveysUsersRepository';
import NpsUtil from '../utils/nps-util';

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveysUsers = await surveysUsersRepository.find({ survey_id, value: Not(IsNull()) });
    const detractor = NpsUtil.filterNps(surveysUsers, 0, 6);
    const passive = NpsUtil.filterNps(surveysUsers, 7, 8);
    const promotors = NpsUtil.filterNps(surveysUsers, 9, 10);
    const totalAnswers = surveysUsers.length;
    const calculate = NpsUtil.calculateNps(promotors, detractor, totalAnswers);

    return response.status(200).json({
      detractor,
      promotors,
      passive,
      totalAnswers,
      nps: calculate,
    });
  }
}

export default new NpsController();
