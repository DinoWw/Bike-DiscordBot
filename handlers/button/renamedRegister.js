
const messageInterface = require("../../scripts/messageInterface.js");

module.exports = {
   prefix: "renamedRegister",
   async execute(interaction) {
      // TODO: commandCode is calculated both in main and here, either pass data as an argument to execute
      // or optimise extraction here
      // this applies to moany other button handlers
		const commandCode = interaction.customId.split('_', 1)[0];
      const data = interaction.customId.slice(commandCode.length+1);
      const _index = data.indexOf('_')
      if(_index == -1){
         console.log(`Invalid button Id`);
         return;
      }
      // else:
      const [ name, id ] = [data.slice(_index+1), data.slice(0, _index)]
      

      console.log(`Prompting new name for (${name} ${id})`);

      await interaction.showModal(messageInterface.modalInputNamePrompt(id, name));
      interaction.deleteReply();
      // TODO: would be cool to just update the message once everything is recieved
      // 	but this dont work and is probably impossible
      //interaction.update(messageInterface.scoringPrompt(id));

   }
}