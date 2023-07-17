class SearchValidator {
  public validate(query: any): { [key: string]: string[] } {
    const errors: { [key: string]: string[] } = {};

    if (typeof query !== 'string') {
      if(!errors['query']) {
        errors['query'] = [];
      }

      errors['query'].push("must be a string");
    }

    if (query.length === 0) {
      if(!errors['query']) {
        errors['query'] = [];
      }

      errors['query'].push("cannot be empty");
    }

    return errors;
  }
}

const validator = new SearchValidator();

export default validator;
