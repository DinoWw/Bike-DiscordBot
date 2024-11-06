
const { ActionRowBuilder, ButtonBuilder, TextInputBuilder, ModalBuilder } = require('discord.js');
const dataInterface = require("./dataInterface.js");


module.exports = {
   scoringPrompt: (memberId, date) => {

      const timeStamp = date.getTime();

      // create action row
      const actionRow = new ActionRowBuilder().addComponents(
         new ButtonBuilder()
            .setCustomId(`one_${timeStamp}_${memberId}`)
            .setLabel("JEDAN BOD")
            .setStyle(1),
         new ButtonBuilder()
            .setCustomId(`two_${timeStamp}_${memberId}`)
            .setLabel("DVA BODA")
            .setStyle(1),
         new ButtonBuilder()
            .setCustomId(`oneSolo_${timeStamp}_${memberId}`)
            .setLabel("JEDAN SOLO")
            .setStyle(1),
         new ButtonBuilder()
            .setCustomId(`twoSolo_${timeStamp}_${memberId}`)
            .setLabel("DVA SOLO")
            .setStyle(1)
      );

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
   scoreSuccessInfo: (name, date, points, solo = false) => {
      return {
         content: `:white_check_mark: Successfully entered ${points} points to ${name} on ${date}${solo ? "as a solo ride" : ""}.`,
         components: [],
         ephemeral: true
      }
   },
   noName: (name) => {
      return {
         content: `:x: No person with name ${name}.`,
         components: [],
         ephemeral: true
      }
   },
   soloLimit: (name) => {
      return {
         content: `:x: ${name} excceeded the number of solo rides this semester.`,
         components: [],
         ephemeral: true
      }
   },
   critcalError: () => {
      return {
         content: `:x::x::x: Critical error occurred, contact the admins.`,
         components: [],
         ephemeral: true
      }
   },
   unauthorizedInfo: () => {
      return {
         content: `You are not authorized to run this command.`,
         components: [],
         ephemeral: true
      }
   },
   datePrompt(startDate, dateCount){

      // TODO: if dateCount is more than 5, attach multiple action rows, up to 25 buttons
      if(dateCount > 5){
         console.log("ERROR: TODO: implement; messageInterface.js");
      }

      let components = [];
      for(let date = startDate; dateCount!= 0; dateCount--){
         components.push(
            new ButtonBuilder()
            .setCustomId(`scoreWithDate_${date.getTime()}`)
            .setLabel(`${date.getDate()}.${date.getMonth()+1}.`)
            .setStyle(1)
         );

         date.setDate(date.getDate() - 1);
      }

      const actionRow = new ActionRowBuilder().addComponents(...components);

      return {
         content: `Choose the ride date.`,
         components: [actionRow],
         ephemeral: true
      }
   }
}