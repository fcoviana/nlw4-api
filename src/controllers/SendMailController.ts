import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';
import SurveysRepository from '../repositories/SurveysRepository';
import SurveysUsersRepository from '../repositories/SurveysUsersRepository';
import UsersRepository from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import { AppError } from '../utils/errors/AppErrors';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({
      email,
    });

    if (!user) {
      throw new AppError('User does not exists', 400, 'BadRequest');
    }

    const surveys = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!surveys) {
      throw new AppError('Survey does not exists', 400, 'BadRequest');
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
    

    const surveysUsersAlreadyExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey'],
    });

    const variables = {
      name: user.name,
      title: surveys.title,
      description: surveys.description,
      id: '',
      link: process.env.URL_MAIL,
    };

    if (surveysUsersAlreadyExists) {
      variables.id = surveysUsersAlreadyExists.id;
      await SendMailService.execute(email, surveys.title, variables, npsPath);
      return response.status(201).json(surveysUsersAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);
    variables.id = surveyUser.id;
    await SendMailService.execute(email, surveys.title, variables, npsPath);

    return response.status(201).json(surveyUser);
  }
}

export default new SendMailController();
