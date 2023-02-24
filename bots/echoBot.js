const { ActivityHandler, MessageFactory, CardFactory } = require('botbuilder');
const exampleCard = require('../resources/exampleCard.json');

class EchoBot extends ActivityHandler {
  starWarsGreetings = 'hello there';
  lorGreetings = 'ring';
  needToPass = 'pass';
  gimliFriend = 'gimli to legolas';
  exampleOfCard = 'example card';

  constructor(userState) {
    super();
    if (!userState)
      throw new Error('[DialogBot]: Missing parameter. userState is required');

    this.welcomedUserProperty = userState.createProperty(
      'welcomedUserProperty',
    );
    this.userState = userState;
    this.onMessage(async (context, next) => {
      const didBotWelcomedUser = await this.welcomedUserProperty.get(
        context,
        false,
      );

      if (didBotWelcomedUser === false) {
        const userName = context.activity.from.name;
        await context.sendActivity(`Welcome on chat user: ${userName}`);

        // Set the flag indicating the bot handled the user's first message.
        await this.welcomedUserProperty.set(context, true);
      } else {
        const userMsg = context.activity.text.toLowerCase();

        switch (userMsg) {
          case this.starWarsGreetings:
            await this.sendReply(context, 'General Kenobi!');
            break;
          case this.lorGreetings:
            await this.sendReply(context, 'Aragorn: You have my sword');
            await this.sendReply(context, 'Legolas: And you have my bow');
            await this.sendReply(context, 'Gimli: And my axe');
            break;
          case this.needToPass:
            await this.sendReply(context, 'You shall not pass!!!');
            break;
          case this.gimliFriend:
            await this.sendReply(
              context,
              "Gimli: I never thought I'd die fighting side by side with an elf.",
            );
            await this.sendReply(
              context,
              'Legolas: What about side by side with a friend?',
            );
            await this.sendReply(context, 'Gimli: Aye, I could do that.');
            break;
          case this.exampleOfCard:
            await context.sendActivity({
              text: 'Here is an Example of Card',
              attachments: [CardFactory.adaptiveCard(exampleCard)],
            });
            break;
          default:
            const responseText = `You said: ${context.activity.text}`;
            await this.sendReply(context, responseText);
        }
      }

      await next();
    });
  }

  async run(context) {
    await super.run(context);

    await this.userState.saveChanges(context);
  }

  sendReply(context, reply) {
    return context.sendActivity(MessageFactory.text(reply, reply));
  }
}

module.exports.EchoBot = EchoBot;
