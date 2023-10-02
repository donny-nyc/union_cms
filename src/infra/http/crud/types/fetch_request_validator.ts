import { Request } from 'express';
import ErrorMap from './error_map';

class FetchRequestValidator {
  public static validate(req: Request): ErrorMap {
    const errors: ErrorMap = {};

    if (req.params.id === undefined) {
      if (!errors['id']) {
        errors['id'] = [];
      }

      errors['id'].push('id must be given');
    }

    return errors;
  }
}

export default FetchRequestValidator;
