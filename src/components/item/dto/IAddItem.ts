import Ajv from 'ajv';
import ItemInfoModel from '../../item-info/model';

interface IAddItem {
  name: string;
  ingredients: string;
  categoryId: number;
  itemInfoAll: ItemInfoModel[];
}

interface IUploadedPhoto {
  imagePath: string;
}

const ajv = new Ajv();

const IAddItemValidator = ajv.compile({
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
    categoryId: {
      type: 'integer',
      minimum: 1
    },
    itemInfoAll: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      uniqueItems: true,
      items: {
        type: 'object',
        properties: {
          size: {
            type: 'string',
            pattern: '^(S|L|XL)$'
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
            minimum: 10.00
          },
          itemId: {
            type: 'integer',
            minimum: 1
          }
        },
        required: [
          'size',
          'energyValue',
          'mass',
          'price'
        ],
        additionalProperties: false
      }
    }
  },
  required: [
    'name',
    'ingredients',
    'categoryId',
    'itemInfoAll'
  ],
  additionalProperties: false
})

export { IAddItem, IAddItemValidator, IUploadedPhoto };
