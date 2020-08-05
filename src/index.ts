import * as sql from 'mssql'

const config: sql.config = {
  user: 'yakik',
  password: 'yakik',
  server: 'DESKTOP-HHU9APQ', // You can use 'localhost\\instance' to connect to named instance
  database: 'RevitP1',
  options: {
    enableArithAbort: true
  },
  beforeConnect: conn => {
    conn.on('debug', message => console.info(message));
    conn.on('error', err => console.error(err));
  }
}


let connection: sql.ConnectionPool = new sql.ConnectionPool(config, function (err: any) {
  if (err != null) {
    console.warn("Issue with connecting to SQL Server!");
  }
  else {
    let requestQuery = new sql.Request(connection);
    let getDataQuery = "select * from RevitP1.dbo.Floors";

    requestQuery.query(getDataQuery, function (err, result) {
      if (err) {
        console.error(`Error happened calling Query: ${err.name} ${err.message}`);
      }
      // checking to see if the articles returned as at least one.
      else if (result.recordset.length > 0) {
        console.dir(result)
      }
    })
  }
})

const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();

const sheet = workbook.addWorksheet('My Sheet');

const cell = sheet.getCell('C3');

cell.value = 42

workbook.xlsx.writeFile('../myExcel.xlsx');

