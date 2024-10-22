const user = require("../../commands/utility/user.js");
const dataInterface = require("../../scripts/dataInterface.js");
const sheetsInterface = require("../../scripts/sheetsInterface.js");
const messageInterface = require("../../scripts/messageInterface.js");
const { TimestampStyles } = require("discord.js");

module.exports = {
   prefix: "oneSolo",
   async execute(interaction) {

      const userName = dataInterface.nameById(interaction.customId.split('_', 2)[1]);

      const message = (await interaction.channel.messages.fetch({limit: 1, cache: false})).at(0);

      const timeStamp = new Date(message.createdTimestamp);
      const date = `${timeStamp.getDate()}.${timeStamp.getMonth()+1}.`;

      sheetsInterface.enterSolo(userName, date, 1)
      .then(() => {
         console.log(`Entered one solo point to ${userName} on ${date}`);
         interaction.update(messageInterface.scoreSuccessInfo(userName, date, 1, true));
      }).catch((e) => {
         if( e instanceof sheetsInterface.UnknownPersonError){
            console.log(`Error entering one point to ${userName} on ${date}, no user ${userName}`);
            interaction.update(messageInterface.noName(userName));
         }
         else if( e instanceof sheetsInterface.SoloRideError){
            console.log(`Error entering one point to ${userName} on ${date}, too many solo rides`);
            interaction.update(messageInterface.soloLimit(userName));
         }
         else{
            throw e;
         }
      });
   }
}