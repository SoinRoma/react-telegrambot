import { Telegraf, Markup } from "telegraf";
const token = "Your Telegram Bot Token";
const bot = new Telegraf(token);
const webAppUrl = "https://soinroma.github.io/react-telegrambot/";

bot.command("start", (ctx) => {
  ctx.reply(
    "Бот запустился! Нажмите на кнопку ниже для запуска приложения!",
    Markup.inlineKeyboard([
      Markup.button.webApp("Запуск Приложения", webAppUrl),
    ])
  );
});
bot.launch();
