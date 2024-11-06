const user = require("../../commands/utility/user.js");
const dataInterface = require("../../scripts/dataInterface.js");
const sheetsInterface = require("../../scripts/sheetsInterface.js");
const messageInterface = require("../../scripts/messageInterface.js");

module.exports = {
   prefix: "two",
   async execute(interaction) {
     
      const args = interaction.customId.split('_', 3);
      const date = new Date(parseInt(args[1]));
      const userName = dataInterface.nameById(args[2]);

      const dateString = `${date.getDate()}.${date.getMonth()+1}.`;

      sheetsInterface.enterPoints(userName, dateString, 2)
      .then(() => {
         console.log(`Entered two points to ${userName} on ${dateString}`);
         interaction.update(messageInterface.scoreSuccessInfo(userName, dateString, 2));
      }).catch((e) => {
         if( e instanceof sheetsInterface.UnknownPersonError){
            console.log(`Error entering two points to ${userName} on ${dateString}, no user ${userName}`);
            interaction.update(messageInterface.noName(userName));
         }
         else{
            throw e;
         }
      });
   }
}