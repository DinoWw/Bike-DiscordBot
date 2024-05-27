



module.exports = 
function fetchMemberByIdAndInteraction(memberId, interaction){
   return interaction.guild.members.fetch(memberId);
}


