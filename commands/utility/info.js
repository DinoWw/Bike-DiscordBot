const { SlashCommandBuilder } = require('discord.js');
const fetchMemberById = require('../../util/fetchMemberById');

const dataInterface = require("../../scripts/dataInterface.js");
const messageInterface = require("../../scripts/messageInterface.js");

// TODO: const SheetsInterface = require("");

// TODO: fetch, do not hard-code
const botId = 1164580596006260737;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')        // TODO: rename or make another command
		.setDescription('Fetches relevant information!'),
	async execute(interaction) {
      // await is needed so that future responses with followUp() do not raise errors
      await interaction.deferReply({ephemeral: true});
      
      // TODO: check rigorously if it works as intended
      await interaction.channel.members.fetch({}).then((members) => {
         members.each(async (val, id) => {
            if(id == botId) return;

            let name = dataInterface.nameById(id)

            // if user is not registered in the table:
            if(name == undefined){
               name = (await fetchMemberById(id, interaction)).displayName;
               interaction.followUp(messageInterface.addDefaultNamePrompt(id, name));
               return;
            }
            // else:
            // TODO: it would be cleaner if these messages did not respond to one another
            // or the original command and instead were sent as separate messages
            interaction.followUp(messageInterface.scoringPrompt(id));
         })
      })
   },
};
