import BaseService from '../../common/BaseService';
import ItemModel, { ItemPhoto } from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import { IAddItem, IUploadedPhoto } from './dto/IAddItem';
import { IEditItem } from './dto/IEditItem';
import CategoryModel from '../category/model';
import ItemInfoModel from '../item-info/model';
import * as fs from 'fs';
import * as path from 'path';
import Config from '../../config/dev';

class ItemModelAdapterOptions implements IModelAdapterOptions {
  loadItemCategory: boolean = false;
  loadAllInfoItem: boolean = false;
  loadPhotos: boolean = false;
}

class ItemService extends BaseService<ItemModel> {
  protected async adaptModel(row: any, options: Partial<ItemModelAdapterOptions>): Promise<ItemModel> {
    const item: ItemModel = new ItemModel();

    item.itemId = +(row?.item_id);
    item.name = row?.name;
    item.ingredients = row?.ingredients;
    item.categoryId = +(row?.category_id)

    if (options.loadItemCategory && item.categoryId) {
      const data = await this.services.categoryService.getById(item.categoryId);
      item.category = data as CategoryModel;
    }

    if (options.loadAllInfoItem) {
      const data = await this.services.itemInfoService.getAllByItemId(item.itemId);
      item.itemInfoAll = data as ItemInfoModel[];
    }

    if (options.loadPhotos) {
      item.photos = await this.getAllPhotosByItemId(item.itemId);
    }

    return item;
  }

  public async getAll(options: Partial<ItemModelAdapterOptions> = { }): Promise<ItemModel[]|IErrorResponse> {
    return await this.getAllFromTable<ItemModelAdapterOptions>(
      'item',
      options
    )
  }

  public async getAllByCategory(categoryId: number, options: Partial<ItemModelAdapterOptions> = { })
    : Promise<ItemModel[]> {
    return await this.getAllByFieldNameFromTable(
      'item',
      'category_id',
      categoryId,
      options
    ) as ItemModel[];;
  }

  public async getAllPhotosByItemId(itemId: number): Promise<ItemPhoto[]> {
    const sql = 'SELECT photo_id, image_path FROM photo WHERE item_id = ?;'
    const [ rows ] = await this.db.execute(sql, [ itemId ]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return [];
    }

    return rows.map(row => {
      return {
        photoId: +(row?.photo_id),
        imagePath: row?.image_path
      }
    })
  }

  public async getById(
    itemId: number,
    options: Partial<ItemModelAdapterOptions> = { }
  ): Promise<ItemModel|null|IErrorResponse> {
    return await this.getByIdFromTable<ItemModelAdapterOptions>(
      'item',
      itemId,
      options
    )
  }

  public async add(data: IAddItem, uploadedPhotos: IUploadedPhoto[]): Promise<ItemModel|IErrorResponse> {
    return new Promise<ItemModel|IErrorResponse>(async resolve => {
      this.db.beginTransaction()
        .then(() => {
          const sql = 'INSERT item SET name = ?, ingredients = ?, category_id = ?;';

          this.db.execute(sql, [data.name, data.ingredients, data.categoryId])
            .then(async res => {
              const insertInfo: any = res[0];
              const newItemId: number = +(insertInfo?.insertId);

              const promises = [];

              for (const itemInfo of data.itemInfoAll) {
                promises.push(
                  this.db.execute(
                    'INSERT item_info SET size = ?, energy_value = ?, mass = ?, price = ?, item_id = ?;',
                    [ itemInfo.size, itemInfo.energyValue, itemInfo.mass, itemInfo.price, newItemId ]
                  )
                )
              }

              for (const uploadedPhoto of uploadedPhotos) {
                promises.push(
                  this.db.execute(
                    'INSERT photo SET item_id = ?, image_path = ?;',
                    [ newItemId, uploadedPhoto.imagePath ]
                  )
                );
              }

              Promise.all(promises)
                .then(async () => {
                  await this.db.commit();

                  resolve(await this.getById(
                    newItemId,
                    {
                      loadItemCategory: true,
                      loadAllInfoItem: true,
                      loadPhotos: true
                    }
                  ));
                })
                .catch(async error => {
                  await this.db.rollback();

                  resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                  })
                })
            })
            .catch(async error => {
              await this.db.rollback();

              resolve({
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
              })
            })
        });
    })
  }

  public async edit(itemId: number, data: IEditItem): Promise<ItemModel|IErrorResponse> {
    return new Promise<ItemModel|IErrorResponse>(async resolve => {
      const sql = 'UPDATE item SET name = ?, ingredients = ? WHERE item_id = ?;';

      this.db.beginTransaction()
        .then(async () => {
          this.db.execute(sql, [ data.name, data.ingredients, itemId ])
            .then(async () => {
              const promises = [];

              for (const itemInfo of data.itemInfoAll) {
                promises.push(
                  this.db.execute(
                    'UPDATE item_info SET energy_value = ?, mass = ?, price = ? WHERE item_info_id = ?;',
                    [ itemInfo.energyValue, itemInfo.mass, itemInfo.price, itemInfo.itemInfoId ]
                  )
                )
              }

              Promise.all(promises)
                .then(async () => {
                  await this.db.commit();

                  resolve(await this.getById(
                    itemId,
                    {
                      loadItemCategory: true,
                      loadAllInfoItem: true,
                      loadPhotos: true
                    }
                  ));
                })
                .catch(async error => {
                  await this.db.rollback();

                  resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                  })
                })
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

  public async delete(itemId: number): Promise<IErrorResponse> {
    return new Promise<IErrorResponse>(resolve => {
      const sql = 'DELETE FROM item WHERE item_id = ?;';
      this.db.execute(sql, [itemId])
        .then(async result => {
          const deleteInfo: any = result[0];
          const deletedRowCount: number = +(deleteInfo?.affectedRows);

          if (deletedRowCount === 1) {
            resolve({
              errorCode: 0,
              errorMessage: 'One record deleted.'
            })
          } else {
            resolve({
              errorCode: -1,
              errorMessage: 'This record could not be deleted, because it not exist.'
            })
          }
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          });
        })
    })
  }

  private deleteItemPhotosAndResizedVersion(filesToDelete: string[]) {
    try {
      for (const fileToDelete of filesToDelete) {
        fs.unlinkSync(fileToDelete);

        const pathParts = path.parse(fileToDelete);

        const directory = pathParts.dir;
        const filename  = pathParts.name;
        const extension = pathParts.ext;

        for (const resizeSpecification of Config.fileUpload.photos.resizes) {
          const resizedImagePath = directory + "/" +
            filename +
            resizeSpecification.suffix +
            extension;

          fs.unlinkSync(resizedImagePath);
        }
      }
    } catch (e) { }
  }

  public async deleteItemPhoto(itemId: number, photoId: number): Promise<IErrorResponse|null> {
    return new Promise<IErrorResponse|null>(async resolve => {
      const item = await this.getById(itemId, {
        loadPhotos: true
      });

      if (item === null) {
        return resolve(null);
      }

      const filteredPhotos = (item as ItemModel).photos.filter(el => el.photoId === photoId);

      if (filteredPhotos.length === 0) {
        return resolve(null);
      }

      const photo = filteredPhotos[0];

      this.db.execute('DELETE FROM photo WHERE photo_id = ?;', [ photo.photoId ])
        .then(() => {
          this.deleteItemPhotosAndResizedVersion([
            photo.imagePath
          ])

          resolve({
            errorCode: 0,
            errorMessage: 'Photo deleted.'
          })
        })
        .catch((error) => resolve({
          errorCode: error?.errno,
          errorMessage: error?.sqlMessage
        }))
    })
  }

  public async addItemPhotos(itemId: number, uploadedPhotos: IUploadedPhoto[]): Promise<ItemModel|IErrorResponse|null> {
    return new Promise<ItemModel|IErrorResponse|null>(async resolve => {
      const item = await this.getById(itemId, {
        loadPhotos: true
      });

      if (item === null) {
        return resolve(null);
      }

      this.db.beginTransaction()
        .then(() => {
          const promises = [];

          for (const uploadedPhoto of uploadedPhotos) {
            promises.push(
              this.db.execute(
                'INSERT photo SET item_id = ?, image_path = ?;',
                [ itemId, uploadedPhoto.imagePath ]
              )
            );
          }

          Promise.all(promises)
            .then(async () => {
              await this.db.commit();

              resolve(await this.services.itemService.getById(
                itemId,
                {
                  loadItemCategory: true,
                  loadAllInfoItem: true,
                  loadPhotos: true
                }
              ));
            })
            .catch(async error => {
              await this.db.rollback();

              resolve({
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
              })
            })
        })
        .catch(async error => {
          await this.db.rollback();

          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        })

    })
  }

}

export default ItemService;
