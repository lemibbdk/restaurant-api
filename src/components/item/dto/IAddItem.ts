import Ajv from 'ajv';

interface IAddItem {
  name: string;
  ingredients: string;
  categoryId: number;
}

const ajv = new Ajv();

const IAddItemValidator = ajv.compile({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 100
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

export { IAddItem, IAddItemValidator };
