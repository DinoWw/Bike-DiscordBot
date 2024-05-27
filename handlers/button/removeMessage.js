module.exports = {
   prefix: "removeMessage",
   async execute(interaction) {
      interaction.deferUpdate();
      interaction.deleteReply();
   }
}