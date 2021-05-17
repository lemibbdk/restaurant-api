import Ajv from 'ajv';

interface IEditItemInfo {
  energyValue: number;
  mass: number;
  price: number;
}

const ajv = new Ajv();

const IEditItemInfoValidator = ajv.compile({
  type: 'object',
  properties: {
    energyValue: {
      type: 'number'
    },
    mass: {
      type: 'number'
    },
    price: {
      type: 'number'
    }
  },
  required: [
    'energyValue',
    'mass',
    'price'
  ],
  additionalProperties: false
})

export { IEditItemInfo, IEditItemInfoValidator };
