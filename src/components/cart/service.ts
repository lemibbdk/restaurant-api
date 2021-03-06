import BaseService from '../../common/BaseService';
import CartModel, { CartItemModel, OrderModel } from './model';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import UserModel from '../user/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IOrderStatus } from './dto/IOrderStatus';
import IAddOrder from './dto/IAddOrder';
import ItemInfoModel from '../item-info/model';
import IEditCart from './dto/IEditCart';
import EvaluationModel from '../evaluation/model';

class CartModelAdapterOptions implements IModelAdapterOptions {
  loadUser: boolean = false;
  loadInfoItems: boolean = false;
  loadOrder: boolean = false;
  loadEvaluation: boolean = false;
}

export default class CartService extends BaseService<CartModel> {
  protected async adaptModel(data: any, options: Partial<CartModelAdapterOptions>): Promise<CartModel> {
    const item:CartModel = new CartModel();

    item.cartId = +(data?.cart_id);
    item.createdAt = new Date(data?.created_at);
    item.userId = +(data?.user_id);

    if (options.loadUser) {
      item.user = await this.services.userService.getById(item.userId) as UserModel;
    }

    if (options.loadInfoItems) {
      item.itemInfos = await this.getAllCartItemsByCartId(item.cartId);
    }

    if (options.loadOrder) {
      item.order = await this.getOrderByCartId(item.cartId);

      if (options.loadEvaluation) item.order.evaluation = await this.getOrderEvaluation(item.order.orderId, item.userId)
    }

    return item;
  }

  private async getAllCartItemsByCartId(cartId: number): Promise<CartItemModel[]> {
    const sql = 'SELECT * FROM cart_item WHERE cart_id = ?;';

    const [ rows ] = await this.db.execute(sql, [ cartId ]);

    if (!Array.isArray((rows)) || rows.length === 0) {
      return [];
    }

    const items: CartItemModel[] = [];

    for (const row of rows) {
      const data = row as any;

      items.push({
        cartItemId: +(data?.cart_item_id),
        itemInfoId: +(data?.item_info_id),
        quantity: +(data?.quantity),
        itemInfo: await this.services.itemInfoService.getById(data?.item_info_id, {
          loadItem: true
        }) as ItemInfoModel
      })
    }

    return items;
  }

  private async getOrderByCartId(cartId: number): Promise<OrderModel|null> {
    const sql = 'SELECT * FROM `order` WHERE cart_id = ?;';

    const [ rows ] = await this.db.execute(sql,[ cartId ]);

    if (!Array.isArray((rows)) || rows.length === 0) {
      return null;
    }

    const order = rows[0] as any;

    const postalAddress = await this.services.postalAddressService.getById(order?.postal_address_id);

    if (postalAddress === null) {
      return null;
    }

    return {
      orderId: +(order?.order_id),
      addressId: +(order?.postal_address_id),
      address: postalAddress,
      createdAt: new Date(order?.created_at),
      status: order?.status,
      desiredDeliveryTime: new Date(order?.desired_delivery_time),
      footnote: order?.footnote
    };
  }

  public async getById(cartId: number, options: Partial<CartModelAdapterOptions> = {}): Promise<CartModel|null> {
    return await this.getByIdFromTable<CartModelAdapterOptions>('cart', cartId, options) as CartModel|null;
  }

  private async add(userId: number): Promise<CartModel|IErrorResponse> {
    return new Promise<CartModel|IErrorResponse>(async resolve => {
      const sql = 'INSERT cart SET user_id = ?;';

      this.db.execute(sql, [ userId ])
        .then(async res => {
          const newCartId: number = +((res as any[])[0]?.insertId);
          resolve(await this.getById(newCartId, {
            loadUser: true
          }));
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        })
    })
  }

  public async getLatestCartByUserId(userId: number, options: Partial<CartModelAdapterOptions> = {}): Promise<CartModel> {
    const sql = `SELECT cart.* FROM cart
                 LEFT JOIN \`order\` ON \`order\`.cart_id = cart.cart_id
                 WHERE cart.user_id = ? AND \`order\`.order_id IS NULL
                 ORDER BY cart.created_at DESC
                 LIMIT 1;`;

    const [ rows ] = await this.db.execute(sql, [ userId ]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return await this.add(userId) as CartModel;
    }

    const cartId: number = +((rows as any[])[0].cart_id);

    return await this.getById(cartId, {
      loadUser: true,
      loadInfoItems: true
    })
  }

  public async addItemToLatestCartByUserId(userId: number, itemInfoId: number, quantity: number): Promise<CartModel|null> {
    const cart = await this.getLatestCartByUserId(userId, {
      loadInfoItems: true
    });

    const order = await this.getOrderByCartId(cart.cartId);

    if (order !== null && order.status !== 'pending') {
      return null;
    }

    const filteredItems = cart.itemInfos.filter(el => el.itemInfoId === itemInfoId);

    if (filteredItems.length === 1) {
      const sql = 'UPDATE cart_item SET quantity = quantity + ? WHERE cart_id = ? AND item_info_id = ?';
      await this.db.execute(sql, [ quantity, cart.cartId, itemInfoId ])
    } else {
      const sql = 'INSERT cart_item SET quantity = ?, cart_id = ?, item_info_id = ?';
      await this.db.execute(sql, [ quantity, cart.cartId, itemInfoId ])
    }

    return await this.getById(cart.cartId, {
      loadInfoItems: true
    })
  }

  public async setItemToCart(userId: number, itemInfoId: number, quantity: number, notLastCart: boolean = false, cartId: number = 0): Promise<CartModel> {
    let cart;
    if (notLastCart) {
      cart = await this.getById(cartId, {
        loadInfoItems: true
      });
    } else {
      cart = await this.getLatestCartByUserId(userId, {
        loadInfoItems: true
      });
    }

    const filteredItems = cart.itemInfos.filter(el => el.itemInfoId === itemInfoId);

    if (filteredItems.length === 1) {
      if (quantity > 0) {
        const sql = 'UPDATE cart_item SET quantity = ? WHERE cart_id = ? AND item_info_id = ?';
        await this.db.execute(sql, [ quantity, cart.cartId, itemInfoId ])
      } else {
        const sql = 'DELETE FROM cart_item WHERE cart_id = ? AND item_info_id = ?';
        await this.db.execute(sql, [ cart.cartId, itemInfoId ])
      }
    } else {
      if (quantity > 0) {
        const sql = 'INSERT cart_item SET quantity = ?, cart_id = ?, item_info_id = ?';
        await this.db.execute(sql, [ quantity, cart.cartId, itemInfoId ])
      }
    }

    return await this.getById(cart.cartId, {
      loadInfoItems: true
    })
  }

  public async makeOrder(userId: number, data: IAddOrder): Promise<CartModel|IErrorResponse> {
    return new Promise<CartModel|IErrorResponse>(async resolve => {
      const cart = await this.getLatestCartByUserId(userId, {
        loadInfoItems: true
      });

      if (cart.itemInfos.length === 0) {
        return resolve({
          errorCode: -1,
          errorMessage: 'You cannot make an order with an empty cart.'
        })
      }

      if (data.status) {
        const sql = 'INSERT INTO `order` SET cart_id = ?, postal_address_id = ?, desired_delivery_time = ?, footnote = ?, status = ?;';
        this.db.execute(sql, [ cart.cartId, data.addressId, data.desiredDeliveryTime, data.footnote, data.status ])
          .then(async () => {
            resolve(await this.getById(cart.cartId, {
              loadInfoItems: true,
              loadOrder: true,
              loadUser: true
            }))
          })
          .catch(error => {
            resolve({
              errorCode: error?.errno,
              errorMessage: error?.sqlMessage
            })
          })
      } else {
        const sql = 'INSERT INTO `order` SET cart_id = ?, postal_address_id = ?, desired_delivery_time = ?, footnote = ?;';
        this.db.execute(sql, [ cart.cartId, data.addressId, data.desiredDeliveryTime, data.footnote ])
          .then(async () => {
            resolve(await this.getById(cart.cartId, {
              loadInfoItems: true,
              loadOrder: true,
              loadUser: true
            }))
          })
          .catch(error => {
            resolve({
              errorCode: error?.errno,
              errorMessage: error?.sqlMessage
            })
          })
      }
    })
  }

  public async editOrder(data: IEditCart): Promise<CartModel|IErrorResponse> {
    return new Promise<CartModel|IErrorResponse>(async resolve => {
      const cart = await this.getById(data.cartId, {
        loadOrder: true,
        loadInfoItems: true
      });


      if (cart.order === null) {
        return resolve({
          errorCode: -3022,
          errorMessage: 'This cart has no order.'
        });
      }

      if (cart.itemInfos.length === 0) {
        return resolve({
          errorCode: -1,
          errorMessage: 'You cannot make an order with an empty cart.'
        })
      }

      this.db.beginTransaction()
        .then(async () => {
          const promises = [];

          for (const cartItem of data.itemInfos) {
            if (cartItem.quantity > 0) {
              const sql = 'UPDATE cart_item SET quantity = ? WHERE cart_id = ? AND item_info_id = ?';
              promises.push(this.db.execute(sql, [ cartItem.quantity, data.cartId, cartItem.itemInfoId ]))
            } else {
              const sql = 'DELETE FROM cart_item WHERE cart_id = ? AND item_info_id = ?';
              promises.push(this.db.execute(sql, [ data.cartId, cartItem.itemInfoId ]));
            }
          }

          const sqlOrder = 'UPDATE `order` SET postal_address_id = ?, desired_delivery_time = ?, footnote = ? WHERE order_id = ?;'
          promises.push(
            this.db.execute(
              sqlOrder,
              [ data.order.addressId,
                data.order.desiredDeliveryTime,
                data.order.footnote,
                data.order.orderId ]
            ))

          Promise.all(promises)
            .then(async () => {
              await this.db.commit();

              resolve(await this.getById(
                cart.cartId,
                {
                  loadOrder: true,
                  loadInfoItems: true
                }
              ))
            })
            .catch(async error => {
              await this.db.rollback();

              resolve({
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
              })
            })
        })

    })
  }

  public async getAllOrdersByUserId(userId: number): Promise<CartModel[]> {
    const sql = `SELECT cart.*
                 FROM cart
                 INNER JOIN \`order\` ON \`order\`.cart_id = cart.cart_id
                 WHERE cart.user_id = ?
                 ORDER BY \`order\`.created_at DESC;`

    const [ rows ] = await this.db.execute(sql, [ userId ]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return [];
    }

    const items: CartModel[] = [];

    for (const row of rows) {
      const data: any = row;

      items.push(await this.adaptModel(data, {
        loadInfoItems: true,
        loadOrder: true,
        loadUser: true,
        loadEvaluation: true
      }));
    }

    return items;
  }

  public async getAllOrders(): Promise<CartModel[]> {
    const sql = `SELECT cart.*
                 FROM cart
                 INNER JOIN \`order\` ON \`order\`.cart_id = cart.cart_id
                 ORDER BY \`order\`.created_at DESC;`

    const [ rows ] = await this.db.execute(sql);

    if (!Array.isArray(rows) || rows.length === 0) {
      return [];
    }

    const items: CartModel[] = [];

    for (const row of rows) {
      const data: any = row;

      items.push(await this.adaptModel(data, {
        loadInfoItems: true,
        loadOrder: true,
        loadUser: true,
      }));
    }

    return items;
  }

  public async setOrderStatus(cartId: number, data: IOrderStatus, cart: CartModel): Promise<CartModel|IErrorResponse> {
    return new Promise<CartModel|IErrorResponse>(async resolve => {
      this.db.execute(
        `UPDATE \`order\` SET \`status\` = ? WHERE order_id = ?;`,
        [ data.status, cart.order.orderId ]
      )
        .then(async () => {
          resolve(await this.getById(cartId, {
            loadOrder: true,
            loadInfoItems: true,
            loadUser: true
          }));
        })
        .catch(err => {
          resolve({
            errorCode: err?.errno,
            errorMessage: err?.sqlMessage,
          });
        });
    });
  }

  public async getOrderEvaluation(orderId: number, userId: number): Promise<EvaluationModel|null> {
    const sql = 'SELECT * FROM evaluation WHERE order_id = ? AND user_id = ?;';

    const [ rows ] = await this.db.execute(sql,[ orderId, userId ]);

    if (!Array.isArray((rows)) || rows.length === 0) {
      return null;
    }

    return rows[0] as EvaluationModel;
  }
}
