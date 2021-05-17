import Ajv from 'ajv';

interface IAddItemInfo {
  size: string;
  energyValue: number;
  mass: number;
  price: number;
  itemId: number | null
}

const ajv = new Ajv();

const IAddItemInfoValidator = ajv.compile({
  type: 'object',
  properties: {
    size: {
      type: 'string',
      pattern: 'S|L|XL'
    },
    energyValue: {
      type: 'number'
    },
    mass: {
      type: 'number'
    },
    price: {
      type: 'number'
    },
    itemId: {
      type: 'integer',
      minimum: 1
    }
  },
  required: [
    'size',
    'energyValue',
    'mass',
    'price',
    'itemId'
  ],
  additionalProperties: false
})

export { IAddItemInfo, IAddItemInfoValidator };
