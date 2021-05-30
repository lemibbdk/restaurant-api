import IConfig from '../common/IConfig.interface';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

const dotenvResult = dotenv.config();

if (dotenvResult.error) throw 'Environment configuration file error: ' + dotenvResult.error;

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
  },
  mail: {
    hostname: process.env?.MAIL_HOST,
    port: +(process.env?.MAIL_PORT),
    secure: process.env?.MAIL_SECURE === 'true',
    username: process.env?.MAIL_USERNAME,
    password: process.env?.MAIL_PASSWORD,
    fromEmail: process.env?.MAIL_FROM,
    debug: true
  },
  auth: {
    user: {
      algorithm: 'RS256',
      issuer: 'localhost',
      auth: {
        duration: 60 * 60 * 24 * 7,
        public: readFileSync('keystore/user-auth.public', 'utf-8'),
        private: readFileSync('keystore/user-auth.private', 'utf-8')
      },
      refresh: {
        duration: 60 * 60 * 24 * 365,
        public: readFileSync('keystore/user-refresh.public', 'utf-8'),
        private: readFileSync('keystore/user-refresh.private', 'utf-8')
      }
    },
    administrator: {
      algorithm: 'RS256',
      issuer: 'localhost',
      auth: {
        duration: 60 * 60 * 24 * 7,
        public: readFileSync('keystore/administrator-auth.public', 'utf-8'),
        private: readFileSync('keystore/administrator-auth.private', 'utf-8')
      },
      refresh: {
        duration: 60 * 60 * 24 * 365,
        public: readFileSync('keystore/administrator-refresh.public', 'utf-8'),
        private: readFileSync('keystore/administrator-refresh.private', 'utf-8')
      }
    }
  }
}

export default Config;
