import Ajv from 'ajv';

interface IAddCategory {
  name: string;
  parentCategoryId: number | null;
}

const ajv = new Ajv();

const IAddCategoryValidator = ajv.compile({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    parentCategoryId: {
      type: ['integer', 'null'],
      minimum: 1
    }
  },
  required: [
    'name'
  ],
  additionalProperties: false
})

export { IAddCategory, IAddCategoryValidator };
