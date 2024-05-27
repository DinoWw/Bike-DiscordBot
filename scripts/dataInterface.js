
const fs = require("fs").promises;



let idName = {};
loadIdNameTable();

// TODO: likely not the best idea to open a file every time I need a json value
//    is it possible to make a global var and then just reaload it every time it cghanges?
module.exports = {
   nameById: (id) => {
      return idName[id]
   },

   addNameForId: async (name, id) => {

      if(idName[id] != undefined) throw new Error(`Name for id ${id} is already set to ${idName[id]}`);

      idName[id] = name;

      return fs.writeFile("${__dirname}/../data/nameById.json", JSON.stringify(idName)).then(()=>{
         console.log(`Set name ${name} for id ${id}`);
      });

   },

   changeNameForId: async (name, id) => {
      if(idName[id] == undefined) throw new Error(`No name set for id ${id}`);

      const prevName = idName[id];      
      idName[id] = name;

      return fs.writeFile("${__dirname}/../data/nameById.json", JSON.stringify(idName)).then(() => {
         console.log(`Changed name from ${prevName} to ${name} for id ${id}`);
      })
   }
}


async function loadIdNameTable(){
   return fs.readFile(`${__dirname}/../data/nameById.json`, {encoding:'utf8'}).then((data) => {

      if(data == '') {
         idName = {};
      }
      else {
         idName = JSON.parse(data);
      }
      console.log("Loaded ID-Name table")
   })
}

