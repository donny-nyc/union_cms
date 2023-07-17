import { Request } from 'express';

type errorMap = {
  [key: string]: string[]
};

class UpdateRequestValidator {
  public validate(req: Request): errorMap {
    const errors: errorMap = {};

    if(!req.params.id) {
      if(!errors['id']) {
        errors['id'] = [];
      }

      errors['id'].push('cannot be null');
    }

    if(req.body.name) {
      
    }

    if(req.body.keywords) {

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
