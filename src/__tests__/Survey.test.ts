import request from 'supertest';
import app from '../app';

import createConnection from '../database';

describe('Surveys API', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it('Should be able to create a new surveys', async () => {
    const response = await request(app).post('/api/surveys').send({
      title: 'any_title',
      description: 'any_decription',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Should be able to get all surveys', async () => {
    await request(app).post('/api/surveys').send({
      title: 'any_title2',
      description: 'any_decription2',
    });

    const response = await request(app).get('/api/surveys');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});
