const dataInterface = require("../scripts/dataInterface.js");

function authorize(interaction){
   const priv = dataInterface.getPrivilegedRole();
   if(priv == undefined){
      console.log("Authorized interaction without privileged role as it is not set.")
      return true;
   }
   else {
      const authorized = interaction.member.roles.cache.has(priv);
      if(!authorized){
         console.log("Attempted authorization of unautorized user");
      }
      return authorized;
   }
}

module.exports = authorize;

