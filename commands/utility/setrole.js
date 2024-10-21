const { SlashCommandBuilder } = require('discord.js');
const authorize = require('../../util/authorize');
const dataInterface = require("../../scripts/dataInterface");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('setrole')
		.setDescription('Set privileged role')
      .addRoleOption(
         (option) => option.setName('role').setDescription('The privileged role').setRequired(true)
      )
      ,
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run

      if(!authorize(interaction)){
         interaction.reply(`You are not authorized to run this command.`);
         return;
      }
      // else
      const role = interaction.options.getRole("role", true);
      dataInterface.setPrivilegedRole(role.id);
      interaction.reply(`Set role ${role} with id ${role.id} as privileged role.`);
	},
};
