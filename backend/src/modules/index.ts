import * as sql from 'mssql'
import * as ExcelJS from 'exceljs'
import async from 'async';
import { query, queries } from './queries'
import { config } from './config'

const workbook = new ExcelJS.Workbook();

let connection: sql.ConnectionPool = new sql.ConnectionPool(config);
export function transformSQL() {
  connection.connect().then(() => {
    async.eachSeries(queries, (query: query, callBack) => {
      //console.log(query)
      const sheet = workbook.addWorksheet(query.sheetName);
      connection.query(query.query).then((data) => {
        let columns = Object.keys(data.recordset[0])
        let worksheetColumns: Array<Object> = []
        columns.forEach(column => {
          worksheetColumns.push({ header: column, key: column })
        })
        sheet.columns = worksheetColumns
        data.recordset.forEach(record => {
          //console.log(record)
          sheet.addRow(record)
        })
        callBack()
      })
    }, (error) => {
      connection.close()
      if (error)
        console.error(error)
      else
        workbook.xlsx.writeFile('../myExcel.xlsx');
    })
  })

}

