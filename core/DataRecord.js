
const dbManager = require("./pgPoolManager")

class DataRecord {
  request;
  render;
  
  constructor(request, render){
    this.request = request;
    this.render = render;
  }

    getResource(){ return this.request.params.resource }
    getQueryParams(){ return this.request.query }
    

    #columnsVal;
    columns(val){ this.#columnsVal = val; }

    #whereVal;
    where(val){ this.#whereVal = val; }

    #orderBy;
    orderBy(val){ this.#orderBy = val; }

    selectQuery(){ return `SELECT ${ this.#columnsVal == null ? "*" : this.#columnsVal } ` }
    fromQuery()  { return ` FROM ${this.getResource()}` }
    whereQuery() { return ` ${ this.#whereVal == null ? "" : `WHERE ${this.#whereVal}` }` }
    orderByQuery() { return ` ${ this.#orderBy == null ? "" : `ORDER BY ${this.#orderBy}` }` }
    
    
    runSelect(callback){
      this.run(`${this.selectQuery()} ${this.fromQuery()} ${this.whereQuery()} ${this.orderByQuery()}`, callback)
    }

    runInsert(values, callback){
      if (this.#columnsVal == null){
        callback("Columns cannot be null for  Insert Request", [])
        return;
      }

      var qurString = `INSERT INTO ${this.getResource()}(${this.#columnsVal}) VALUES (${values})`
      
      this.run(qurString, callback)
    }

    runUpdate(callback){
      if (this.#columnsVal == null){
        callback("Columns cannot be null for  Insert Request", [])
        return;
      }

      var qurString = `UPDATE ${this.getResource()} SET ${this.#columnsVal} ${ this.whereQuery() }`
      this.run(qurString, callback)
    }

    runDelete(callback){
      if (this.#whereVal == null){
        callback("Where clause cannot be null for  Delete Request", [])
        return;
      }

      var qurString = `DELETE FROM ${this.getResource()} ${ this.whereQuery() }`
      this.run(qurString, callback)
    }

    run(query, callback){
      dbManager.all(query, (err, result)=>{
        this.#columnsVal = null;
        this.#whereVal = null;
        callback(err, result)
      });
    }
}
module.exports = DataRecord