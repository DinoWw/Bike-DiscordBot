const { SlashCommandBuilder } = require('discord.js');

const messageInterface = require("../../scripts/messageInterface.js");
const authorize = require("../../util/authorize.js");



module.exports = {
	data: new SlashCommandBuilder()
		.setName('bod')
		.setDescription('Unosi bodove korisnicima iz threada'),
	async execute(interaction) {
      
      if(!authorize(interaction)){
         interaction.reply(messageInterface.unauthorizedInfo());
         return;
      }
      
      const message = (await interaction.channel.messages.fetch({limit: 1, cache: false})).at(0);
      const date = new Date(message.createdTimestamp);

      await interaction.reply(messageInterface.datePrompt(date, 3));
   },
};
