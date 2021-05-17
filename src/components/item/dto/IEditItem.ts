import Ajv from 'ajv';

interface IEditItem {
  name: string;
  ingredients: string;
  categoryId: number;
}

const ajv = new Ajv();

const IEditItemValidator = ajv.compile({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 30
    },
    ingredients: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    categoryId: {
      type: 'integer',
      minimum: 1
    }
  },
  required: [
    'name',
    'ingredients',
    'categoryId'
  ],
  additionalProperties: false
})

export { IEditItem, IEditItemValidator };
