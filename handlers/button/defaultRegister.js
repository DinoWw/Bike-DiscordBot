
const messageInterface = require("../../scripts/messageInterface.js");
const dataInterface = require("../../scripts/dataInterface.js");

module.exports = {
   prefix: "defaultRegister",
   async execute(interaction) {
		const commandCode = interaction.customId.split('_', 1)[0];
      const data = interaction.customId.slice(commandCode.length+1);
      const _index = data.indexOf('_')
      if(_index == -1){
         console.error(`Invalid button Id`);
         return;
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
         return;
      }
      // else:
      console.log(`Adding name ${name} under id ${id}`);

      dataInterface.addNameForId(name, id).then(() => {
         interaction.update(messageInterface.scoringPrompt(id));
      }).catch((err) => {
         interaction.update(messageInterface.critcalError());
         throw err;
      });
   }
}