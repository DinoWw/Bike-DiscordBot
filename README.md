# Setup

## Configuration
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
```
.env
```
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=   # server ID
```

## Register commands
node deploy_commands.js

## Start bot
node main.js