import * as express from 'express';
import * as cors from 'cors';
import Config from './config/dev';
import CategoryRouter from './components/category/router';
import * as mysql2 from 'mysql2/promise';
import IApplicationResources from './common/IApplicationResources.interface';
import Router from './router';
import ItemRouter from './components/item/router';
import ItemInfoRouter from './components/item-info/router';
import ItemService from './components/item/service';
import ItemInfoService from './components/item-info/service';
import CategoryService from './components/category/service';
import * as fileUpload from 'express-fileupload';
import AdministratorService from './components/administrator/service';
import AdministratorRouter from './components/administrator/router';
import UserService from './components/user/service';
import UserRouter from './components/user/router';
import PostalAddressService from './components/postal-address/service';
import AuthRouter from './components/auth/router';
import CartService from './components/cart/service';
import CartRouter from './components/cart/router';
import EvaluationService from './components/evaluation/service';
import EvaluationRouter from './components/evaluation/router';

async function main() {
  const application: express.Application = express();

  application.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  application.use(express.json());
  application.use(fileUpload({
    limits: {
      fileSize: Config.fileUpload.maxSize,
      files: Config.fileUpload.maxFiles,
    },
    useTempFiles: true,
    tempFileDir: Config.fileUpload.temporaryDirectory,
    uploadTimeout: Config.fileUpload.timeout,
    safeFileNames: true,
    preserveExtension: true,
    createParentPath: true,
    abortOnLimit: true
  }))

  const resources: IApplicationResources = {
    databaseConnection: await mysql2.createConnection({
      host: Config.database.host,
      port: Config.database.port,
      user: Config.database.user,
      password: Config.database.password,
      database: Config.database.database,
      charset: Config.database.charset,
      timezone: Config.database.timezone,
      supportBigNumbers: true
    })
  }

  resources.databaseConnection.connect();

  resources.services = {
    itemService: new ItemService(resources),
    itemInfoService: new ItemInfoService(resources),
    categoryService: new CategoryService(resources),
    administratorService: new AdministratorService(resources),
    userService: new UserService(resources),
    postalAddressService: new PostalAddressService(resources),
    cartService: new CartService(resources),
    evaluationService: new EvaluationService(resources)
  }

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

  Router.setupRoutes(application, resources, [
    new CategoryRouter(),
    new ItemRouter(),
    new ItemInfoRouter(),
    new AdministratorRouter(),
    new UserRouter(),
    new AuthRouter(),
    new CartRouter(),
    new EvaluationRouter()
  ]);

  application.use((err, req, res, next) => {
    res.status(err.status).send(err.type);
  })

  application.listen(Config.server.port)
}

main();
