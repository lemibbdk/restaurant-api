import { NextFunction, Request, Response } from 'express';
import ItemModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddItem, IAddItemValidator, IUploadedPhoto } from './dto/IAddItem';
import { IEditItem, IEditItemValidator } from './dto/IEditItem';
import BaseController from '../../common/BaseController';
import CategoryModel from '../category/model';
import Config from '../../config/dev';
import { v4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
import sizeOf from 'image-size';
import * as path from 'path';
import * as sharp from 'sharp';
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

  private isPhotoValid(file: UploadedFile): { isOk: boolean, message?: string } {
    const size = sizeOf(file.tempFilePath);

    const limits = Config.fileUpload.photos.limits;

    if (size.width < limits.minWidth) {
      return {
        isOk: false,
        message: `The img must have a width of at least ${limits.minWidth}`
      }
    }

    if (size.height < limits.minHeight) {
      return {
        isOk: false,
        message: `The img must have a height of at least ${limits.minHeight}`
      }
    }

    if (size.width > limits.maxWidth) {
      return {
        isOk: false,
        message: `The img must have a width of at most ${limits.maxWidth}`
      }
    }

    if (size.height > limits.maxHeight) {
      return {
        isOk: false,
        message: `The img must have a width of at most ${limits.maxHeight}`
      }
    }


    return {
      isOk: true
    };
  }

  private async resizeUploadedPhoto(imagePath: string) {
    const pathParts = path.parse(imagePath);

    const directory = pathParts.dir;
    const filename = pathParts.name;
    const extension = pathParts.ext;

    for (const resizeSpecification of Config.fileUpload.photos.resizes) {
      const resizedImagePath = directory + '/' + filename + resizeSpecification.suffix + extension;

      await sharp(imagePath)
        .resize({
          width: resizeSpecification.width,
          height: resizeSpecification.height,
          fit: resizeSpecification.fit,
          background: { r: 255, g: 255, b: 255, alpha: 1.0 },
          withoutEnlargement: true
        })
        .toFile(resizedImagePath);
    }
  }

  private async uploadFiles(req: Request, res: Response): Promise<IUploadedPhoto[]> {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('You must upload at lease one and a maximum of '
        + Config.fileUpload.maxFiles + ' photos.');
      return [];
    }

    const fileKeys: string[] = Object.keys(req.files);

    const uploadedPhotos: IUploadedPhoto[] = [];

    for (const fileKey of fileKeys) {
      const file = req.files[fileKey] as any;

      const result = this.isPhotoValid(file);
      if (result.isOk === false) {
        res.status(400).send(`Error with image ${fileKey}: "${result.message}"`);
        return [];
      }

      const randomString = v4();
      const originalName = file?.name;
      const now = new Date();

      const imagePath = Config.fileUpload.uploadDestinationDirectory +
        (Config.fileUpload.uploadDestinationDirectory.endsWith('/') ? '' : '/') +
        now.getFullYear() + '/' + ((now.getMonth() + 1) + '').padStart(2, '0') + '/' +
        randomString + '-' + originalName;

      await file.mv(imagePath);

      await this.resizeUploadedPhoto(imagePath);

      uploadedPhotos.push({
        imagePath: imagePath
      });
    }

    return uploadedPhotos;
  }

  public async add(req: Request, res: Response, next: NextFunction) {
    const uploadedPhotos = await this.uploadFiles(req, res);

    if (uploadedPhotos.length === 0) {
      return;
    }

    try {
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
    } catch (e) {
      res.status(400).send(e?.message);
    }
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

    const itemResult = await this.services.itemService.getById(itemId, {loadAllInfoItem: true});

    if (itemResult === null) {
      res.sendStatus(404);
      return;
    }

    if (!(itemResult instanceof ItemModel)) {
      return itemResult;
    }

    const data = req.body as IEditItem;

    const itemInfoIds = itemResult.itemInfoAll.map(el => el.itemInfoId);

    for (const info of data.itemInfoAll) {
      if (info.itemInfoId <= 0) {
        res.sendStatus(400);
        return;
      }

      if (!itemInfoIds.includes(info.itemInfoId)) {
        res.status(400).send({errorMessage: `Item info ${info.itemInfoId} is not for regular item.` })
        return;
      }

      const itemInfo = await this.services.itemInfoService.getById(info.itemInfoId);

      if (itemInfo === null) {
        res.status(404).send({errorMessage: `Item info ${info.itemInfoId} not found.`});
        return;
      }

      if (!(itemInfo instanceof ItemInfoModel)) {
        res.status(400).send({errorMessage: 'Invalid item info.'});
        return;
      }

      if (itemInfo.itemId !== itemId) {
        res.sendStatus(400);
        return;
      }
    }

    const result = await this.services.itemService.edit(itemId, data as IEditItem);

    if (result === null) {
      res.sendStatus(404)
      return;
    }

    res.send(result);
  }

  public async deleteItemPhoto(req: Request, res: Response) {
    const itemId: number = +(req.params.iid);
    const photoId: number = +(req.params.pid);

    if (itemId <= 0 || photoId <= 0) {
      return res.sendStatus(400);
    }

    const result = await this.services.itemService.deleteItemPhoto(itemId, photoId);

    if (result === null) {
      return res.sendStatus(404);
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
    const sizes = data.itemInfoAll.map(el => el.size);

    if (!sizes.includes('S') || !sizes.includes('L') || !sizes.includes('XL')) {
      return {
        status: 500,
        data: {errorMessage: 'Have duplicated sizes.'}
      }
    }

  }
}

export default ItemController;
