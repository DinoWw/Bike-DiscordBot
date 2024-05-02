// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const dataInterface = require('./scripts/dataInterface');
const messageInterface = require("./scripts/messageInterface.js");

require('dotenv').config()

// add timestamps in front of log messages
require('log-timestamp');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
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
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// setup command responses

client.on(Events.InteractionCreate, async interaction => {
	// TODO: tu napravit handlere za button inpute
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
	// TODO: load button interaction handlers from separate file
	else if ( interaction.isButton() ){
		//interaction.deferUpdate();
		
		const commandCode = interaction.customId.split('_', 1)[0];

		switch(commandCode){
			case "removeMessage":
				interaction.deferUpdate();
				interaction.deleteReply();
			break;
			case "defaultRegister":{
				const data = interaction.customId.slice(commandCode.length+1);
				const _index = data.indexOf('_')
				if(_index == -1){
					console.error(`Invalid button Id`);
					break;
				}
				// else:
				const [ name, id ] = [data.slice(_index+1), data.slice(0, _index)]
				const storedName = dataInterface.nameById(id);
				if(storedName != undefined){
					// inform the user something went wrong
					console.error(`Attempted to add ${name} under id ${id} when ${id} is already ${storedName}`);
					interaction.update({
						content: `Somthing went wrong adding name ${name} under id ${id}. Contact the admins.`,
						components: []
					})
					break;
				}
				// else:
				console.log(`Adding name ${name} under id ${id}`);

				dataInterface.addNameForId(name, id).then(() => {
					interaction.update(messageInterface.scoringPrompt(id));
				}).catch((err) => {
					interaction.update(messageInterface.critcalError());
					throw err;
				});
			break;
			}
			case "renamedRegister":{
				const data = interaction.customId.slice(commandCode.length+1);
				const _index = data.indexOf('_')
				if(_index == -1){
					console.error(`Invalid button Id`);
					break;
				}
				// else:
				const [ name, id ] = [data.slice(_index+1), data.slice(0, _index)]
				

				console.log(`Prompting new name for (${name} ${id})`);

				await interaction.showModal(messageInterface.modalInputNamePrompt(id, name));
				interaction.deleteReply();
				// TODO: would be cool to just update the message once everything is recieved
				// 	but this dont work and is probably impossible
				//interaction.update(messageInterface.scoringPrompt(id));


			break;
			}

			//interaction.message.delete();
		}


		/*
		interaction.update({
			content: `Receieved input from button: ${interaction.customId}`,
			components: []
		})*/
	}
	else if (interaction.isModalSubmit()){

		console.log(interaction.fields.fields)

		interaction.fields.fields.forEach((field) => {
			const commandCode = field.customId.split('_', 1)[0];
			const data = field.customId.slice(commandCode.length+1);

			switch(commandCode){
				case "register": {
					dataInterface.addNameForId(field.value, data).then(() => {
						return interaction.reply(messageInterface.scoringPrompt(data));
					});


					break;
				}
			}
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
*/


