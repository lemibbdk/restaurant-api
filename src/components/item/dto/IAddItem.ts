import Ajv from 'ajv';

interface IAddItem {
  name: string;
  ingredients: string;
}

const ajv = new Ajv();

const IAddItemValidator = ajv.compile({
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
    }
  },
  required: [
    'name',
    'ingredients'
  ],
  additionalProperties: false
})

export { IAddItem, IAddItemValidator };
