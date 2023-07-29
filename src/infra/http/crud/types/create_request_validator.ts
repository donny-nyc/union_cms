import { Request } from 'express';
import ErrorMap from './error_map';

class CreateRequestValidator {
  public validate(req: Request): ErrorMap {
    const errors: ErrorMap = {};

    return errors;
  }
}

const validator = new CreateRequestValidator();

export default validator;
