import { Request } from 'express';
import ErrorMap from './error_map';

class UpdateRequestValidator {
  public validate(req: Request): ErrorMap {
    const errors: ErrorMap = {};

    if(!req.params.id) {
      if(!errors['id']) {
        errors['id'] = [];
      }

      errors['id'].push('cannot be null');
    }

    console.log(req.body);

    if(req.body.name !== undefined && req.body.name.length === 0) {
      if(!errors['name']) {
        errors['name'] = [];
      }

      errors['name'].push('cannot be empty');
    }

    if(req.body.keywords !== undefined && req.body.keywords.length === 0) {
      if(!errors['keywords']) {
        errors['keywords'] = [];
      }

      errors['keywords'].push('cannot be empty');
    }

    if(req.body.price) {
      if(req.body.price < 0) {
        if(!errors['price']) {
          errors['price'] = []
        }

        errors['price'].push("cannot be negative");
      }
    }

    return errors;
  }
};

const validator = new UpdateRequestValidator();

export default validator;
