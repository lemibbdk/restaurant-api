import Ajv from 'ajv';
import addFormats from 'ajv-formats';

interface IAddOrder {
  addressId: number;
  desiredDeliveryTime: Date;
  footnote: string;
  status: string;
}

const ajv = new Ajv();
addFormats(ajv);

const IAddOrderValidator = ajv.compile({
  type: 'object',
  properties: {
    addressId: {
      type: 'number',
      minimum: 1
    },
    desiredDeliveryTime: {
      type: 'string',
      format: 'date-time'
    },
    footnote: {
      type: 'string',
      maxLength: 32 * 1024
    },
    status: {
      type: 'string',
      pattern: '^(rejected)$'
    }
  },
  required: [
    'addressId',
    'desiredDeliveryTime',
    'footnote'
  ],
  additionalProperties: false
});

export default IAddOrder;
export { IAddOrderValidator };
