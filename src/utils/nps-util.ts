import SurveyUser from '../models/SurveyUser';

class NpsUtil {
  static filterNps(list: SurveyUser[], first: number, last: number) : number {
    return list.filter((survey) => survey.value >= first && survey.value <= last).length;
  }
  
  static calculateNps(promotors: number, detractor: number, totalAnswers: number) : number {
    return Number((((promotors - detractor) / totalAnswers) * 100).toFixed(2));
  }
}

export default NpsUtil;
