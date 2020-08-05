export interface query {
    sheetName: string,
    query: string
  }
  
  
  export const queries: Array<query> = [{ sheetName: 'mySum', query: 'select sum(Area) as sum_area,TypeId from RevitP1.dbo.Floors group by TypeId' },
  { sheetName: 'myCount', query: 'select count(Area) as sum_area,TypeId from RevitP1.dbo.Floors group by TypeId' }]
  