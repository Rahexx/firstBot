const restify = require('restify');
const botbuilder = require('botbuilder');
const { EchoBot } = require('./bots/echoBot');

// Create bot adapter, which defines how the bot sends and receives messages.
const adapter = new botbuilder.BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log(`\n${server.name} listening to ${server.url}`);
  console.log(
    `\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`,
  );
});

const onTurnErrorHandler = async (context, error) => {
  console.error(`Unhandled error: ${error}`);

  await context.sendTraceActivity('OnTurnError Trace', error);
  await context.sendActivity('The bot encountered an error or bug.');
  await context.sendActivity(
    'To continue to run this bot, please fix the bot source code',
  );
};

adapter.onTurnError = onTurnErrorHandler;

const memoryStorage = new botbuilder.MemoryStorage();
const userState = new botbuilder.UserState(memoryStorage);
const echoBot = new EchoBot(userState);

server.post('/api/messages', (req, res, next) => {
  adapter.processActivity(req, res, async (turnContext) => {
    if (turnContext.activity.type === 'message') {
      // Get the user's text
      const utterance = turnContext.activity.text;
      if (turnContext.activity.text !== '') {
        await adapter.process(req, res, (context) => echoBot.run(context));
      }
    }
  });
});
