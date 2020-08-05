import * as sql from 'mssql'

export const config: sql.config = {
    user: 'yakik',
    password: 'yakik',
    server: 'DESKTOP-HHU9APQ',
    database: 'RevitP1',
    options: {
      enableArithAbort: true
    },
    beforeConnect: conn => {
      //conn.on('debug', message => console.info(message));
      conn.on('error', err => console.error('CCDCCD' + err));
    }
  }