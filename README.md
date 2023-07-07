# MikoBot

## A Discord bot to generate messages using Markov chains

## Installation

1. Clone this repository and install the dependencies:

```sh
git clone https://github.com/SBence/mikobot.git
cd mikobot
npm install
```

2. Add your bot token to the `.env` file in the project directory:

```
DISCORD_TOKEN=<insert your Discord bot token here>
```

_For more information on how to create a bot application, [see here](https://discord.com/developers/docs/getting-started#creating-an-app)._

3. Run the application:

```sh
node src/index.js
```

## Bot usage

### Invite the bot to your server

For more information on how to do so, [see here](https://discord.com/developers/docs/getting-started#adding-scopes-and-permissions).

On the _OAuth2 URL Generator_ page, make sure to check **bot** under _Scopes_ and check **Read Messages/View Channels** and **Send Messages** under _Bot Permissions_.

To generate a message, **@mention** the bot user. _Note that by default the bot also sends generated messages when the number of messages sent by users reaches a certain amount since the bot last sent a message._

## Bot configuration

To prevent the bot from sending messages in certain channels, simply use Discord's permission system to disable the **View Channel** permission for the bot in such channels.
