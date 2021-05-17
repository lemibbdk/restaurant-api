import Ajv from 'ajv';

interface IEditCategory {
  name: string;
}

const ajv = new Ajv();

const IEditCategoryValidator = ajv.compile({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    }
  },
  required: [
    'name'
  ],
  additionalProperties: false
})

export { IEditCategory, IEditCategoryValidator };
