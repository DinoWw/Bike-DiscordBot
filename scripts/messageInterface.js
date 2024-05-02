
const { ActionRowBuilder, ButtonBuilder, TextInputBuilder, ModalBuilder } = require('discord.js');
const dataInterface = require("./dataInterface.js");


module.exports = {
   scoringPrompt: (memberId) => {

      //TODO: action row is kinda ugly, set emojis for buttons

      // create action row
      const actionRow = new ActionRowBuilder().addComponents(
         new ButtonBuilder()
            .setCustomId(`solo_${memberId}`)
            .setLabel("SOLO")
            .setStyle(1),
         new ButtonBuilder()
            .setCustomId(`one_${memberId}`)
            .setLabel("JEDAN BOD")
            .setStyle(1),
         new ButtonBuilder()
            .setCustomId(`two_${memberId}`)
            .setLabel("DVA BODA")
            .setStyle(1)
         );

         // TODO: make prettier message

         // reply with message and action row for each user
         return {
         content: `Points for ${dataInterface.nameById(memberId)}`,
         components: [actionRow],
         ephemeral: true
      };
   },
   addDefaultNamePrompt: (memberId, memberDefaultName) => {

      const actionRow = new ActionRowBuilder().addComponents(
         new ButtonBuilder()
         .setCustomId(`defaultRegister_${memberId}_${memberDefaultName}`)
         .setLabel(`Add as ${memberDefaultName}`)
         .setStyle(1),
         new ButtonBuilder()
         .setCustomId(`renamedRegister_${memberId}_${memberDefaultName}`)
         .setLabel("Add renamed")
         .setStyle(1),
         new ButtonBuilder()
         .setCustomId(`removeMessage`)
         .setLabel("Do not add")
         .setStyle(1)
      );

      return {
         content: `Name ${memberDefaultName} not found, do you wish to add it?`,
         components: [actionRow],
         ephemeral: true
      };

   },

   modalInputNamePrompt: (memberId, memberDefaultName = "") => {
     
      const modal = new ModalBuilder()
      .setCustomId('myModal')
      .setTitle('Name input').addComponents(
         new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId(`register_${memberId}`)
            .setRequired()
            .setLabel(`Name for ${memberDefaultName}`)
            .setStyle(1)
         )
      );

      return modal;
   },

   critcalError: () => {
      return {
         content: `Critical error occurred, contact the admins.`,
         ephemeral: true
      }
   }
}