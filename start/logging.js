

require("express-async-errors");

module.exports = (req,res,next)=>{
    process.on('uncaughtException',(ex)=>{
       console.error(ex.message);
       process.exit(1);
    });

    process.on("unhandledRejection",(ex)=>{
        throw ex;
    });

};