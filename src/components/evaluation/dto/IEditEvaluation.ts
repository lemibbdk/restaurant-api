import Ajv from 'ajv';

interface IEditEvaluation {
  evaluationId: number;
  orderId: number;
  score: string;
  remark: string;
}

const ajv = new Ajv();

const IEditEvaluationValidator = ajv.compile({
  type: 'object',
  properties: {
    evaluationId: {
      type: 'number',
      minimum: 1
    },
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
    'evaluationId',
    'orderId',
    'score',
    'remark'
  ],
  additionalProperties: false
})

export { IEditEvaluation, IEditEvaluationValidator };
