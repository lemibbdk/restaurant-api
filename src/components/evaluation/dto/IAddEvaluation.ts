import Ajv from 'ajv';

interface IAddEvaluation {
  orderId: number;
  score: string;
  remark: string;
}

const ajv = new Ajv();

const IAddEvaluationValidator = ajv.compile({
  type: 'object',
  properties: {
    orderId: {
      type: 'number',
      minimum: 1
    },
    score: {
      type: 'string',
      pattern: '^(1|2|3|4|5)$'
    },
    remark: {
      type: 'string',
      maxLength: 4 * 1024
    }
  },
  required: [
    'orderId',
    'score',
    'remark'
  ],
  additionalProperties: false
})

export { IAddEvaluation, IAddEvaluationValidator };
