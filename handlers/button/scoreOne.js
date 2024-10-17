const user = require("../../commands/utility/user.js");
const dataInterface = require("../../scripts/dataInterface.js");
const sheetsInterface = require("../../scripts/sheetsInterface.js");
const messageInterface = require("../../scripts/messageInterface.js");

module.exports = {
   prefix: "one",
   async execute(interaction) {

      const userName = dataInterface.nameById(interaction.customId.split('_', 2)[1]);

      const message = (await interaction.channel.messages.fetch({limit: 1, cache: false})).at(0);

      const timeStamp = new Date(message.createdTimestamp);
      const date = `${timeStamp.getDate()}.${timeStamp.getMonth()+1}.`;

      sheetsInterface.enterPoints(userName, date, 1)
      .then(() => {
         console.log(`Entered one point to ${userName} on ${date}`);
         interaction.update(messageInterface.scoreSuccessInfo(userName, date, 1));
      }).catch((e) => {
         if( e instanceof sheetsInterface.UnknownPersonError){
            console.error(`Error entering one point to ${userName} on ${date}, no user ${userName}`);
            interaction.update(messageInterface.noName(userName));
         }
         else{
            throw e;
         }
      });
   }
}
