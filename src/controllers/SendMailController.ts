import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';
import SurveysRepository from '../repositories/SurveysRepository';
import SurveysUsersRepository from '../repositories/SurveysUsersRepository';
import UsersRepository from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';

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
      return response.status(400).json({
        error: 'BadRequest',
        message: 'User does not exists',
      });
    }

    const surveys = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!surveys) {
      return response.status(400).json({
        error: 'BadRequest',
        message: 'Survey does not exists',
      });
    }
    
    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
    const variables = {
      name: user.name,
      title: surveys.title,
      description: surveys.description,
      user_id: user.id,
      link: process.env.URL_MAIL
    };

    const surveysUsersAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id }, { value: null }],
      relations: ['user', 'survey']
    });


    if (surveysUsersAlreadyExists) {
      await SendMailService.execute(email, surveys.title, variables, npsPath);
      return response.status(201).json(surveysUsersAlreadyExists);  
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(
      email,
      surveys.title,
      variables,
      npsPath
    );

    return response.status(201).json(surveyUser);
  }
}

export default new SendMailController();
