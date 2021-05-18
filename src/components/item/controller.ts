import { NextFunction, Request, Response } from 'express';
import ItemModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddItem, IAddItemValidator, IUploadedPhoto } from './dto/IAddItem';
import { IEditItem, IEditItemValidator } from './dto/IEditItem';
import BaseController from '../../common/BaseController';
import CategoryModel from '../category/model';
import Config from '../../config/dev';
import { v4 } from 'uuid';
import ItemInfoModel from '../item-info/model';

class ItemController extends BaseController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const items = await this.services.itemService.getAll();

    res.send(items);
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    const itemId = +(req.params.id);

    if (itemId <= 0) {
      res.sendStatus(400);
      return;
    }

    const data: ItemModel|null|IErrorResponse = await this.services.itemService.getById(itemId, {
      loadAllInfoItem: true,
      loadItemCategory: true
    });

    if (data === null) {
      res.sendStatus(404);
      return;
    }

    if (data instanceof ItemModel) {
      res.send(data);
      return;
    }

    res.status(500).send(data);
  }

  public async add(req: Request, res: Response, next: NextFunction) {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('You must upload at lease one and a maximum of '
        + Config.fileUpload.maxFiles + ' photos.');
      return;
    }

    const fileKeys: string[] = Object.keys(req.files);

    const uploadedPhotos: IUploadedPhoto[] = [];

    for (const fileKey of fileKeys) {
      const file = req.files[fileKey] as any;
      const randomString = v4();
      const originalName = file?.name;
      const now = new Date();

      const imagePath = Config.fileUpload.uploadDestinationDirectory +
        (Config.fileUpload.uploadDestinationDirectory.endsWith('/') ? '' : '/') +
        now.getFullYear() + '/' + ((now.getMonth() + 1) + '').padStart(2, '0') + '/' +
        randomString + '-' + originalName;

      await file.mv(imagePath);

      uploadedPhotos.push({
        imagePath: imagePath
      })
    }

    const data = JSON.parse(req.body?.data);

    if (!IAddItemValidator(data)) {
      res.status(400).send(IAddItemValidator.errors);
      return;
    }

    const item = data as IAddItem;

    if (item.categoryId <= 0) {
      res.sendStatus(400);
      return;
    }

    const sizeInfoCheck = this.checkSizes(item);
    if (sizeInfoCheck?.status) {
      res.status(sizeInfoCheck.status).send(sizeInfoCheck.data);
    }

    const categoryData = await this.categoryValidation(item.categoryId);

    if (categoryData?.status) {
      res.status(categoryData.status).send(categoryData.data);
      return;
    }

    const result = await this.services.itemService.add(item, uploadedPhotos);

    res.send(result);
  }

  public async edit(req: Request, res: Response, next: NextFunction) {
    const itemId = +(req.params.id);

    if (itemId <= 0) {
      res.sendStatus(400)
      return;
    }

    if (!IEditItemValidator(req.body)) {
      res.status(400).send(IEditItemValidator.errors);
      return;
    }

    const data = req.body as IEditItem;

    const categoryData = await this.categoryValidation(data);
    if (categoryData?.status) {
      res.status(categoryData.status).send(categoryData.data);
    }

    const result = await this.services.itemService.edit(itemId, data as IEditItem);

    if (result === null) {
      res.sendStatus(404)
      return;
    }

    res.send(result);
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;

    const itemId: number = +id;

    if (itemId <= 0) {
      res.status(400).send('Invalid ID number.');
      return;
    }

    res.send(await this.services.itemService.delete(itemId));
  }

  async categoryValidation(categoryId) {
    const categoryResult: CategoryModel|null|IErrorResponse = await this.services.categoryService.getById(
      categoryId,
      {
        loadSubcategories: true
      });

    if (categoryResult === null) {
      return {
        status: 404,
        data: {errorMessage: "Category doesn't exist."}
      }
    }

    if (categoryResult instanceof CategoryModel) {
      if (categoryResult.subCategories.length !== 0) {
        return {
          status: 400,
          data: { errorMessage: 'Item category can be only low level category.' }
        }
      }
    } else {
      return {
        status: 500,
        data: categoryResult
      }
    }
  }

  public checkSizes(data: IAddItem) {
    const sizes = data.infos.map(el => el.size);

    if (!sizes.includes('S') || !sizes.includes('L') || !sizes.includes('XL')) {
      return {
        status: 500,
        data: {errorMessage: 'Have duplicated sizes.'}
      }
    }

  }
}

export default ItemController;
