import Ajv from 'ajv';

interface IEditAdministrator {
  password: string;
}

const ajv = new Ajv();

const IEditAdministratorValidator = ajv.compile({
  type: 'object',
  properties: {
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 255
    }
  },
  required: [
    'password'
  ],
  additionalProperties: false
})

export { IEditAdministrator, IEditAdministratorValidator };
