import BaseService from '../../common/BaseService';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import EvaluationModel from './model';
import { IAddEvaluation } from './dto/IAddEvaluation';

class EvaluationAdapterOptions implements IModelAdapterOptions {
  loadOrder: boolean = false;
}

class EvaluationService extends BaseService<EvaluationModel> {
  protected async adaptModel(data: any, options: Partial<EvaluationAdapterOptions>): Promise<EvaluationModel> {
    const item:EvaluationModel = new EvaluationModel();

    item.evaluationId = +(data?.evaluation_id);
    item.orderId = +(data?.order_id);
    item.score = data?.score;
    item.remark = data?.remark;

    if (options.loadOrder) {
      // item.order = await this.services.cartService.(item.userId);
    }

    return item;
  }

  public async getAll(): Promise<EvaluationModel[]> {
    return await this.getAllFromTable('evaluation', {}) as EvaluationModel[];
  }

  public async getById(
    evaluationId: number,
    options: Partial<EvaluationAdapterOptions> = { }
  ): Promise<EvaluationModel|null> {
    return await this.getByIdFromTable('evaluation', evaluationId, options) as EvaluationModel|null;
  }

  public async add(data: IAddEvaluation): Promise<EvaluationModel|IErrorResponse> {
    return new Promise<EvaluationModel|IErrorResponse>(async resolve => {
      const sql = 'INSERT evaluation SET score = ?, remark = ?, order_id = ?;';

      this.db.execute(sql, [data.score, data.remark, data.orderId ])
        .then(async result => {
          const insertInfo: any = result[0];

          const newEvaluationId: number = +(insertInfo?.insertId);
          resolve(await this.getById(newEvaluationId));
        })
        .catch(error => {
          if (error?.errno === 1452) {
            resolve({
              errorCode: -3,
              errorMessage: 'Evaluation does not exist.'
            })
          }

          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        })
    })
  }
}

export default EvaluationService;
