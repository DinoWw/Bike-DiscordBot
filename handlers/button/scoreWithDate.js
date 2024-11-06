const fetchMemberById = require('../../util/fetchMemberById.js');
const dataInterface = require("../../scripts/dataInterface.js");
const messageInterface = require("../../scripts/messageInterface.js");

// TODO: fetch, do not hard-code
const botId = 1164580596006260737;

module.exports = {
   prefix: "scoreWithDate",
   async execute(interaction) {
      const args = interaction.customId.split('_', 2);
      const timeStamp = parseInt(args[1]);
      
      // await is needed so that future responses with followUp() do not raise errors
      await interaction.deferReply({ephemeral: true});
      
      // TODO: check why replies seem to cascade instead of coming simontaneously
      await interaction.channel.members.fetch({}).then((members) => {
         members.each(async (_val, id) => {
            if(id == botId) return;

            let name = dataInterface.nameById(id)

            if(name == undefined){
               fetchMemberById(id, interaction).then((member) => {
                  name = member.displayName;
                  return interaction.followUp(messageInterface.addDefaultNamePrompt(id, name));
               })
            }
            else {
               interaction.followUp(messageInterface.scoringPrompt(id, new Date(timeStamp)));
            }
         })
      })
   }
}
