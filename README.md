# Setup

## 1. Configuration
sheets-credentials/credentials.json
```json
{
   "installed": {
      "client_id": "",
      "project_id": "",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_secret": "",
      "redirect_uris": [
         "http://localhost"
      ]
   }
}
```env
.env
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=   # server ID
```

## 2. Register commands
`node deploy_commands.js`

## 3. Start bot
`node main.js`
If running with nodemon: `nodemon --ignore 'data/*' main.js`


# Modules
## sheets interface
- must call and await authorize() before any other function calls

# Known bugs
- if two people have the same name, only one of them will ever get points. 
   you can bypass this by registering one of them as Name Surname 1 
   both in the table and through the bot