// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

require('dotenv').config()

// add timestamps in front of log messages
require('log-timestamp');

const sheetsInterface = require("./scripts/sheetsInterface.js");
sheetsInterface.authorize().then(()=>console.log("Google Sheets authentification complete"));

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Logged into Discord as as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);


// read commands

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing the required "data" or "execute" property.`);
		}
	}
}

// read handlers
const [buttonHandlers, modalHandlers] = [{}, {}];
const buttonPath = path.join(__dirname, 'handlers/button');
const modalPath = path.join(__dirname, 'handlers/modal');
const buttonFiles = fs.readdirSync(buttonPath).filter(file => file.endsWith('.js'));
const modalFiles = fs.readdirSync(modalPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
	const filePath = path.join(buttonPath, file);
	const handler = require(filePath);
	if ('prefix' in handler && 'execute' in handler) {
		buttonHandlers[handler.prefix] = handler.execute;
	} else {
		console.log(`[WARNING] The handler at ${filePath} is missing a required "prefix" or "execute" property.`);
	}
}

for (const file of modalFiles) {
	const filePath = path.join(modalPath, file);
	const handler = require(filePath);
	if ('prefix' in handler && 'execute' in handler) {
		modalHandlers[handler.prefix] = handler.execute;
	} else {
		console.log(`[WARNING] The handler at ${filePath} is missing a required "prefix" or "execute" property.`);
	}
}





// setup command responses

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()){

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
	
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
	 	
	else if ( interaction.isButton() ){
		const commandCode = interaction.customId.split('_', 1)[0];
		// TODO: wrap in try catch in case interaction is not registered
		buttonHandlers[commandCode](interaction);

	}
	else if (interaction.isModalSubmit()){

		interaction.fields.fields.forEach((field) => {
			const commandCode = field.customId.split('_', 1)[0];
			const data = field.customId.slice(commandCode.length+1);

			// TODO: wrap in try catch
			modalHandlers[commandCode](interaction, field, data);

		})

	}
	else {
		console.error("Unusual interaction recieved:");
		console.error(interaction);
	}

});




/* TODO: give the user feedback on button press through
interaction.update({
  content: "A component interaction was received",
  components: []
})

// first edit the message to say working..., then make it say what it did or didnt do
// post requests for working... and actual work can go in paralell, 
// then the final edit only after the table was altered
// make it say 'princess pussy slay queen' at random times
*/


