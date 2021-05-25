export default interface IConfig {
  server: {
    port: number,
    static: {
      path: string,
      route: string,
      cacheControl: boolean,
      dotfiles: string,
      etag: boolean,
      maxAge: number,
      index: boolean
    }
  },
  logger: {
    path: string
  },
  database: {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
    charset: string,
    timezone: string
  },
  fileUpload: {
    maxSize: number;
    maxFiles: number;
    timeout: number;
    temporaryDirectory: string;
    uploadDestinationDirectory: string;
    photos: {
      limits: {
        minWidth: number;
        maxWidth: number;
        minHeight: number;
        maxHeight: number;
      },
      resizes: {
        suffix: string;
        width: number;
        height: number;
        fit: 'cover'|'contain';
      }[]
    }
  }
}
