const { Surreal } = require("surrealdb.js")

exports.migrate = async (db) => {
  db = Object.assign(new Surreal(), db)
  
  // Migration instructions
}

exports.rollback = async (db) => {
  db = Object.assign(new Surreal(), db)

  // Rollback isntructions
}
