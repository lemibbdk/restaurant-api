import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { CartItemModel, OrderModel } from '../model';

interface IEditCart {
  cartId: number;
  itemInfos: CartItemModel[];
  order: OrderModel;
}

const ajv = new Ajv();
addFormats(ajv);

const IEditOrderValidator = ajv.compile({
  type: 'object',
  properties: {
    cartId: {
      type: "number",
      minimum: 1
    },
    itemInfos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          cartItemId: {
            type: 'number',
            minimum: 1
          },
          quantity: {
            type: 'number',
            minimum: 0
          },
          itemInfoId: {
            type: 'number',
            minimum: 1
          }
        },
        required: [
          'cartItemId',
          'quantity',
          'itemInfoId'
        ]
      }
    },
    order: {
      type: 'object',
      properties: {
        orderId: {
          type: 'number',
          minimum: 1
        },
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
      },
      required: [
        'orderId',
        'addressId',
        'desiredDeliveryTime',
        'footnote'
      ]
    }
  },
  required: [
    'cartId',
    'itemInfos',
    'order'
  ],
  additionalProperties: false
});

export default IEditCart;
export { IEditOrderValidator };
