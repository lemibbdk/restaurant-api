import Ajv from 'ajv';

interface IEditItem {
  name: string;
  ingredients: string;
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
    }
  },
  required: [
    'name',
    'ingredients'
  ],
  additionalProperties: false
})

export { IEditItem, IEditItemValidator };
