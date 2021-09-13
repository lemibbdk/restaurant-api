import Ajv from 'ajv';
import ItemInfoModel from '../../item-info/model';

interface IEditItem {
  name: string;
  ingredients: string;
  itemInfoAll: ItemInfoModel[];
}

const ajv = new Ajv();

const IEditItemValidator = ajv.compile({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    ingredients: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    itemInfoAll: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      uniqueItems: true,
      items: {
        type: 'object',
        properties: {
          itemInfoId: {
            type: 'integer',
            minimum: 1
          },
          energyValue: {
            type: 'number'
          },
          mass: {
            type: 'number',
            minimum: 0.5
          },
          price: {
            type: 'number',
            minimum: 2.00
          }
        },
        required: [
          'itemInfoId',
          'energyValue',
          'mass',
          'price',
        ],
        additionalProperties: false
      }
    }
  },
  required: [
    'name',
    'ingredients',
    'itemInfoAll'
  ],
  additionalProperties: false
})

export { IEditItem, IEditItemValidator };
