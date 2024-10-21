
const fs = require("fs").promises;

const SEM_CONFIG_FILENAME = "semesterConfig.json";
const NAME_ID_FILENAME = "nameById.json"

let idName = {};
let semConfig = {};
Promise.all([loadIdNameTable(), loadSemesterConfig()])
.then(() => console.log("Loaded config files"));

module.exports = {
   nameById: (id) => {
      return idName[id]
   },

   addNameForId: async (name, id) => {

      if(idName[id] != undefined) throw new Error(`Name for id ${id} is already set to ${idName[id]}`);

      idName[id] = name;

      return fillFile(NAME_ID_FILENAME, idName).then(()=>{
         console.log(`Set name ${name} for id ${id}`);
      });

   },

   changeNameForId: async (name, id) => {
      if(idName[id] == undefined) throw new Error(`No name set for id ${id}`);

      const prevName = idName[id];      
      idName[id] = name;

      return fillFile(NAME_ID_FILENAME, idName).then(() => {
         console.log(`Changed name from ${prevName} to ${name} for id ${id}`);
      })
   },

   setPrivilegedRole: async function (roleId) {
      semConfig.privilegedRole = roleId;
      
      return fillFile(SEM_CONFIG_FILENAME, semConfig).then(() => {
         console.log(`Set privileged role to ${roleId}`);
      })
   },
   getPrivilegedRole: function () {
      return semConfig.privilegedRole;
   }
}

async function fillFile(fileName, content) {
   return fs.writeFile(`${__dirname}/../data/${fileName}`, JSON.stringify(content))
}

async function loadFile(fileName){
   return fs.readFile(`${__dirname}/../data/${fileName}`, {encoding:'utf8'}).then((data) => {

      if(data == '') {
         content = {};
      }
      else {
         content = JSON.parse(data);
      }
      return content
   }).catch(e => {
      // TODO: create file
      fs.writeFile( `${__dirname}/../data/${fileName}`, "{}");
      return {}; 
   })
}

async function loadSemesterConfig() {
   semConfig = await loadFile(SEM_CONFIG_FILENAME);
}

async function loadIdNameTable(){
   idName = await loadFile(NAME_ID_FILENAME);
}

