import * as express from 'express';
import * as cors from 'cors';
import Config from './config/dev';
import CategoryService from './components/category/service';
import CategoryController from './components/category/controller';

const application: express.Application = express();

application.use(cors())
application.use(express.json())

application.use(
  Config.server.static.route,
  express.static(
    Config.server.static.path, {
      cacheControl: Config.server.static.cacheControl,
      dotfiles: Config.server.static.dotfiles,
      etag: Config.server.static.etag,
      maxAge: Config.server.static.maxAge,
      index: Config.server.static.index
    }
  )
)

const categoryService: CategoryService = new CategoryService();
const categoryController: CategoryController = new CategoryController(categoryService);

application.get('/category', categoryController.getAll.bind(categoryController));

application.listen(Config.server.port)
