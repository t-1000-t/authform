const axios = require('axios')
const { Telegraf } = require('telegraf')
const cheerio = require('cheerio')


const bot = new Telegraf(process.env.BOT_TOKEN)

module.exports = { bot, axios, cheerio }