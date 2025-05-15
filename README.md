# MikoBot

A Discord bot to generate messages using Markov chains

## Installation

1. Clone this repository, install the dependencies and build the bot:

   ```sh
   git clone https://github.com/SBence/mikobot.git
   cd mikobot
   yarn install
   yarn run build
   ```

2. Add your bot token to the `.env` file in the project directory:

   ```properties
   TOKEN=<insert your Discord bot token here>
   ```

   _For more information on creating a bot application, [see here](https://discord.com/developers/docs/getting-started#creating-an-app)._

3. Run `build/index.js` using your preferred method. (For example, to run with Node.js: `node build/index.js`)

## Bot usage

### Invite the bot to your server

For more information on how to do so, [see here](https://discord.com/developers/docs/getting-started#adding-scopes-and-permissions).

> [!IMPORTANT]
> On the _OAuth2_ page, make sure to check **bot** under _Scopes_ and check **View Channels**, **Send Messages** and **Read Message History** under _Bot Permissions_. Additionally, on the **Bot** page, make sure that **Message Content Intent** is enabled under _Privileged Gateway Intents_.

To generate a message, **@mention** the bot user. _Note that by default the bot also sends generated messages when the number of messages sent by users reaches a certain amount since the bot last sent a message._

## Bot configuration

To prevent the bot from sending messages in certain channels, simply use Discord's permission system to disable the **View Channel** permission for the bot in such channels.
