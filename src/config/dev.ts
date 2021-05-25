import IConfig from '../common/IConfig.interface';

const Config: IConfig = {
  server: {
    port: 40080,
    static: {
      path: "./static/",
      route: "/static",
      cacheControl: false,
      dotfiles: "deny",
      etag: false,
      maxAge: 3600000,
      index: false
    }
  },
  logger: {
    path: "logs/access.log"
  },
  database: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "restaurant",
    charset: "utf8",
    timezone: "+01:00"
  },
  fileUpload: {
    maxSize: 5 * 1024 * 1024,
    maxFiles: 5,
    timeout: 30000,
    temporaryDirectory: '../temp/',
    uploadDestinationDirectory: 'static/uploads/',
    photos: {
      limits: {
        minWidth: 320,
        maxWidth: 1920,
        minHeight: 200,
        maxHeight: 1440,
      },
      resizes: [
        {
          suffix: '-medium',
          fit: 'cover',
          width: 800,
          height: 600,
        },
        {
          suffix: '-small',
          fit: 'cover',
          width: 400,
          height: 300,
        },
        {
          suffix: '-thumb',
          fit: 'cover',
          width: 250,
          height: 200
        }
      ]
    }
  }
}

export default Config;
