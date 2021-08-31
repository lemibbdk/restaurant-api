import IModel from '../../common/IModel.interface';
import { OrderModel } from '../cart/model';

class EvaluationModel implements IModel {
  evaluationId: number;
  orderId: number;
  order: OrderModel;
  score: string;
  remark: string;
}

export default EvaluationModel;
