import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import SurveysUsersRepository from '../repositories/SurveysUsersRepository';
import { AppError } from '../utils/errors/AppErrors';

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveyUser = await surveysUsersRepository.findOne({ id: String(u) });

    if (!surveyUser) {
      throw new AppError('Survey Users does not exists', 400, 'BadRequest');
    }
    surveyUser.value = Number(value);
    await surveysUsersRepository.save(surveyUser);

    return response.status(201).json(surveyUser);
  }
}

export default new AnswerController();
