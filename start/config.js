const config = require("config");

module.exports = ()=>{
   
    if(!config.get("db")){
      throw new Error("FATAL ERROR! db is not set.");
    }
    if(!config.get("mailPass")){
      throw new Error("FATAL ERROR! mailPass is not set.");
    }   
}
  