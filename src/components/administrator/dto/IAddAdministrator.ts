import Ajv from 'ajv';

interface IAddAdministrator {
  username: string;
  password: string;
}

const ajv = new Ajv();

const IAddAdministratorValidator = ajv.compile({
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 5,
      maxLength: 30
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 255
    }
  },
  required: [
    'username',
    'password'
  ],
  additionalProperties: false
})

export { IAddAdministrator, IAddAdministratorValidator };
