import * as sql from 'mssql'
import * as ExcelJS from 'exceljs'
import async from 'async';



const config: sql.config = {
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

interface query {
  sheetName: string,
  query: string
}


let queries: Array<query> = [{ sheetName: 'mySum', query: 'select sum(Area) as sum_area,TypeId from RevitP1.dbo.Floors group by TypeId' },
{ sheetName: 'myCount', query: 'select count(Area) as sum_area,TypeId from RevitP1.dbo.Floors group by TypeId' }]

const workbook = new ExcelJS.Workbook();

let connection: sql.ConnectionPool = new sql.ConnectionPool(config);
connection.connect().then(() => {
  async.eachSeries(queries, (query: query,callBack) => {
    console.log(query)
    const sheet = workbook.addWorksheet(query.sheetName);
    connection.query(query.query).then((data) => {
      let columns = Object.keys(data.recordset[0])
      let worksheetColumns: Array<Object> = []
      columns.forEach(column => {
        worksheetColumns.push({ header: column, key: column })
      })
      sheet.columns = worksheetColumns
      data.recordset.forEach(record => {
        console.log(record)
        sheet.addRow(record)
      })
      callBack()
    })
  }, (error) => {
    connection.close()
    console.log('HHHHH')
    if (error)
      console.error(error)
    else
      workbook.xlsx.writeFile('../myExcel.xlsx');
      console.log('HHHHHEEEEE')
  })
})



