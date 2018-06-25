import { on, configurable } from '@popcorn.moe/migi'
import * as configuration from './defaultConfig.json'

@configurable('welcome', configuration)
export default class Welcome {
  constructor(migi, settings) {
    this.migi = migi
    this.settings = settings
  }

	@on('guildMemberAdd')
	onWelcome(member) {
    const sGuild = this.settings.guilds[member.guild.id]
    if (!sGuild) return
    const { channel: sChannel, role, welcome } = sGuild

    const channel = member.guild.channels.get(sChannel)

    return Promise.all([
      channel && welcome && channel.send(this.fillMessage(welcome, member)),
      member.addRole(role)
    ])
  }

	@on('guildMemberRemove')
	onBye(member) {
    const sGuild = this.settings.guilds[member.guild.id]
    if (!sGuild) return
    const { channel: sChannel, bye } = sGuild
    
    const channel = member.guild.channels.get(sChannel)

    if (channel && bye)
      return channel.send(this.fillMessage(bye, member))
	}
  
  fillMessage(message, member) {
    return (Array.isArray(message) ? message.join('') : message)
      .replace('$user', member)
      .replace('$displayName', member.displayName)
  }
}