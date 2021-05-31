import Ajv from 'ajv';

interface IAddCart {
  itemInfoId: number;
  quantity: number;
}

const ajv = new Ajv();

const IAddCartValidator = ajv.compile({
  type: 'object',
  properties: {
    itemInfoId: {
      type: 'integer',
      minimum: 1
    },
    quantity: {
      type: 'integer',
      minimum: 0
    }
  },
  required: [
    'itemInfoId',
    'quantity'
  ],
  additionalProperties: false
});

export default IAddCart;
export { IAddCartValidator };
