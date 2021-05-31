import Ajv from "ajv";

interface IOrderStatus {
  status: 'pending' | 'rejected' | 'accepted' | 'completed';
}

const ajv = new Ajv();

const IOrderStatusValidator = ajv.compile({
  type: 'object',
  properties: {
    status: {
      type: 'string',
      pattern: '^(pending|rejected|accepted|completed)$',
    },
  },
  required: [
    'status'
  ],
  additionalProperties: false,
});

export { IOrderStatus };
export { IOrderStatusValidator };
