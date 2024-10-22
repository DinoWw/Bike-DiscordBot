// Use with `await require("sheetsInterface");`

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'sheets-credentials/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'sheets-credentials/credentials.json');
const SPREADSHEET_ID = '1SURe9iQohSOA4uIEGmIC9deCo3HONKM-U3nTZ0Tcwsk';  // TODO: put into .env

const sheets = google.sheets('v4');

const SOLO_COLUMN = 'A';
const NAME_COLUMN = 'C';
const FIRST_DATE_COLUMN = 'G';
const DATE_ROW = 1;

var SOLO_RIDES = 2;

var _nameColumnCache = [];
var _dateRowCache = [];

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}
 
 /**
  * Load or request or authorization to call APIs.
  *
  */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();  // TODO: catch if token is invalid or old and prompt user to login
    if (client) {
      google.options({auth: client});
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    google.options({auth: client});
    return client;
}

async function getSingleValue(location) {
  // TODO: maybe implement location validity checks
  const res = await sheets.spreadsheets.values.get({
    majorDimension: 'COLUMNS',
    range: location,
    spreadsheetId: SPREADSHEET_ID,
  });
  return res.data.values[0][0];
}

function columnToLetter(column)
{
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function letterToColumn(letter)
{
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++)
  {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}

// TODO: does not handle if multiple people have the same name!!
async function rowByName(name) {  
  if(_nameColumnCache.length == 0){
    await reloadNames();
  }

  let rowId = _nameColumnCache.findIndex((n) => n == name);
  if(rowId == -1){
    await reloadNames();
    rowId = _nameColumnCache.findIndex((n) => n == name);
    if(rowId == -1)
      throw new UnknownPersonError(`No person with name ${name}`);
  }
  return rowId + 2;
}

async function reloadNames() {
  const res = await sheets.spreadsheets.values.get({
    majorDimension: 'COLUMNS',
    range: `${NAME_COLUMN}2:${NAME_COLUMN}`,
    spreadsheetId: SPREADSHEET_ID,
  });
  _nameColumnCache = res.data.values[0];
}

// TODO: finish, range is still incorrect
// TODO: check date format
async function columnByDate(date) {  
  if(_dateRowCache.length == 0){

    await reloadDates();
  }

  const colId = _dateRowCache.findIndex((n) => n == date);
  if(colId == -1){
    return undefined;
  }
  return columnToLetter(colId + FIRST_DATE_COLUMN.charCodeAt(0) - "A".charCodeAt(0) + 1);
}

async function reloadDates() {
  const res = await sheets.spreadsheets.values.get({
    majorDimension: 'ROWS',
    range: `${FIRST_DATE_COLUMN}${DATE_ROW}:${DATE_ROW}`,
    spreadsheetId: SPREADSHEET_ID,
  });
  _dateRowCache = res.data.values[0];
}

// creates column if non existant
async function ensureColumnByDate(date) {
  let col = await columnByDate(date)
  if(col){
    return col;
  }
  // else insert new col
  
  col = columnToLetter(_dateRowCache.length + letterToColumn(FIRST_DATE_COLUMN));

  // await not needed because new col is known
  const res = sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range:`${col}${DATE_ROW}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [date]
      ],
    },
  });

  // update _dateRowCache
  _dateRowCache.push(date);

  // TODO: there really should be a way to check that the previous request did not overwrite a date
  //  but that would require two calls to the API and would slow down the app :(
  return col;
}


class UnknownPersonError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnknownPersonError';
  }
}
class SoloRideError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SoloRideError';
  }
}

// authorize MUST be called before any other functions
const exportObject = { 
  authorize,
  reloadDates,
  setMaxSolo: function (max_solo) {
    SOLO_RIDES = max_solo;
  },
  enterPoints: async function (name, date, points) {
    let row = await rowByName(name);
    let col = await ensureColumnByDate(date);

    return sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${col}${row}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [points]
        ],
      },
    });
  }, 
  enterSolo: async function (name, date, points) {
    
    const loc = `${SOLO_COLUMN}${await rowByName(name)}`;
    const soloN = await getSingleValue(loc);

    // TODO: check if this works for non zero previous solo rides
    if(soloN >= SOLO_RIDES){
      throw new SoloRideError(`Upisivanje bi premašilo maksimum od ${SOLO_RIDES} vožnji.`);
    }
    // else:
    return Promise.all([
      this.enterPoints(name, date, points),
      sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: loc,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [soloN+1]
          ],
        },
      })
    ]).catch((el) => {
      if(el[1] == undefined){
        throw el[0];
      }
      else throw el[1];
    });
  },
  UnknownPersonError,
  SoloRideError
}
 

// Acquire an auth client, and bind it to all future calls


// TODO: set spreadsheet ID to be input through bot and saved to file
// TODO: to ensure proper loading and login, export only a funciton 
//    that when called authenticates and returns the exportObject
module.exports = exportObject;