import { NextFunction, Response} from 'express';

export default (schema) => async (request: Request, response: Response, _next: NextFunction) => {
  try {
    await schema.validate(request.body);
    return _next();
  } catch (err) {
    return response.status(400).json({ 
      error: 'BadRequest',
      message: err.errors[0]  
    });
  }
};
