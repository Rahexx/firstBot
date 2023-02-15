const { ActivityHandler, MessageFactory } = require('botbuilder');

class EchoBot extends ActivityHandler {
  starWarsGreetings = 'hello there';
  lorGreetings = 'ring';
  needToPass = 'pass';
  gimliFriend = 'gimli to legolas';

  constructor() {
    super();

    this.onMessage(async (context, next) => {
      const userMsg = context.activity.text.toLowerCase();

      if (userMsg.includes(this.starWarsGreetings)) {
        await this.sendReply(context, 'General Kenobi!');
      } else if (userMsg === this.lorGreetings) {
        await this.sendReply(context, 'Aragorn: You have my sword');
        await this.sendReply(context, 'Legolas: And you have my bow');
        await this.sendReply(context, 'Gimli: And my axe');
      } else if (userMsg.includes(this.needToPass)) {
        await this.sendReply(context, 'You shall not pass!!!');
      } else if (userMsg === this.gimliFriend) {
        await this.sendReply(
          context,
          "Gimli: I never thought I'd die fighting side by side with an elf.",
        );
        await this.sendReply(
          context,
          'Legolas: What about side by side with a friend?',
        );
        await this.sendReply(context, 'Gimli: Aye, I could do that.');
      } else {
        const responseText = `You said: ${context.activity.text}`;
        await this.sendReply(context, responseText);
      }

      await next();
    });
  }

  sendReply(context, reply) {
    return context.sendActivity(MessageFactory.text(reply, reply));
  }
}

module.exports.EchoBot = EchoBot;
