import { audio, custom, youtube } from '../streamer'
import { Composer } from '../composer'
import { __ } from '../i18n'

const composer = new Composer().on('message')

export default composer

composer.command(['stream', 's', 'play', 'p'], async ctx => {
  const input =
    ctx.message.reply_to_message?.audio ||
    ctx.message.reply_to_message?.voice ||
    ctx.message.reply_to_message?.text ||
    ctx.message.text.split(/\s/)[1]

  const isCustomInput = typeof input === 'string' && 'custom'.includes(input)
  const customInput = ctx.message.text.split(/\s/)[2]

  if (!input || (isCustomInput && !customInput)) {
    await ctx.reply(__('no_input'))
    return
  }

  const result =
    typeof input === 'string'
      ? isCustomInput
        ? await custom(ctx, customInput!)
        : await youtube(ctx, ctx.from!, input)
      : await audio(ctx)

  if (result == null) {
    await ctx.reply(__('streaming'))
    return
  }

  await ctx.reply(__('queued_at', { position: String(result) }))
})
