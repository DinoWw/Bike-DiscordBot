const dataInterface = require("../../scripts/dataInterface.js")
const messageInterface = require("../../scripts/messageInterface.js")


module.exports = {
   prefix: "register",
   async execute(interaction, field, data) {

      // TODO: error handling, forbid '_' and potentially other special characters in name
      dataInterface.addNameForId(field.value, data).then(() => {
         return interaction.reply(messageInterface.scoringPrompt(data));
      });

   }
}