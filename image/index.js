import { configurable, RichEmbed, sendDiscordError } from '@popcorn.moe/migi'
import { re } from 're-template-tag'
import * as configuration from './defaultConfig.json'

const USER_MATCH = /<@!(\d+)>?/
const randomIn = array => array[Math.floor(Math.random(array.length))]

@configurable('image', configuration)
export default class Image {
	constructor(migi, { category, commands, usage }) {
		this.migi = migi

		this.category = category
		this.commands = commands
		this.usage = usage

		process.nextTick(() => this.setup())
	}

	setup() {
		Object.entries(this.commands).forEach(([name, cmd]) =>
			this.setupOne(name, cmd)
		)
	}

	setupOne(name, { desc, msg, gifs }) {
		const regex = re`^${name}(?: <@!?(\d+)>)?`

		this[name] = (message, mention) => {
			const { member, guild } = message

			return Promise.all([
				message.delete(),
				this.response(
					message,
					msg,
					gifs,
					mention ? message.member : message.guild.me,
					mention ? message.guild.members.get(mention) : message.member
				)
			])
		}

		this.migi.command(regex, this, name, {
			name,
			desc,
			usage: this.usage
		})
	}

	response(message, msg, gifs, from, to) {
		if (!to)
			return sendDiscordError(message.channel, 'Aucun utilisateur trouvé 😭')

		const send = msg
			.replace('{0}', from.displayName)
			.replace('{1}', to.displayName)

		const embed = new RichEmbed()
			.setTitle(send)
			.setColor(0x00ae86)
			.setImage(randomIn(gifs))

		return message.channel.send({ embed })
	}
}
