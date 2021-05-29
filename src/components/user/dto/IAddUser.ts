import Ajv from 'ajv';
import PostalAddressModel from '../../postal-address/model';

interface IAddUser {
  email: string;
  password: string;
  forename: string;
  surname: string;
  postalAddresses: PostalAddressModel[];
}

const ajv = new Ajv();

const IAddUserValidator = ajv.compile({
  type: 'object',
  properties: {
    email: {
      type: 'string',
      minLength: 8,
      maxLength: 255
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 255
    },
    forename: {
      type: 'string',
      minLength: 2,
      maxLength: 64
    },
    surname: {
      type: 'string',
      minLength: 2,
      maxLength: 64
    },
    postalAddresses: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      items: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            minLength: 5,
            maxLength: 64 * 1024
          },
          phoneNumber: {
            type: 'string',
            minLength: 5,
            maxLength: 24
          }
        },
        required: [
          'address',
          'phoneNumber'
        ],
        additionalProperties: false
      }
    }
  },
  required: [
    'email',
    'password',
    'forename',
    'surname',
    'postalAddresses'
  ],
  additionalProperties: false
})

export { IAddUser, IAddUserValidator };
