const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild


		const a = ""//interaction.member.roles.map(r => `${r}`).join(' | ');
		let b = interaction.member.roles.cache.has("")
		await interaction.reply(`This command was run by ${interaction.user.username},
who joined on ${interaction.member.joinedAt} \
and has roles ${interaction.member.roles.cache.toJSON()}, ${b}`);
	},
};
