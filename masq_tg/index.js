
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start((ctx) => ctx.reply(`I'm the masquerade delivery bot, your chat ID is ${ctx.message.chat.id}.`));
bot.help((ctx) => ctx.reply(`Visit masquerade.something to begin NFT redemption.`));
bot.on('text', (ctx) => ctx.reply(`I don't accept messages. Visit masquerade.something to redeem an NFT`)); //listen to every text message
bot.on('message', ctx => ctx.reply('Command not recognized')); //avoid timeouts with unsupported commands
bot.telegram.setWebhook(
    `https://${process.env.TELEGRAM_BOT_CLOUD_REGION}-${process.env.TELEGRAM_BOT_CLOUD_PROJECT_ID}.cloudfunctions.net/masq-tg-helper` //FUNCTION_TARGET is reserved Google Cloud Env
);


exports.MasqueradeTelegramBot = (req, res) => {
  bot.handleUpdate(req.body, res);
}
