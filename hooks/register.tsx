import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const isBusy = atom({ plugin: 'improve-prompt', key: 'isBusy' } as const, false)

const SYSTEM = `Tu es un expert en rédaction de prompts pour un assistant de programmation IA.
Réécris le prompt de l'utilisateur pour le rendre clair, précis et actionnable:
- conserve exactement l'intention, la langue et les noms de fichiers/identifiants;
- précise l'objectif, le contexte, les contraintes et le résultat attendu;
- n'invente aucun fait ni exigence absents du prompt d'origine;
- reste concis, sans préambule.
Réponds UNIQUEMENT avec le prompt amélioré, sans guillemets ni explication.`

export const register: Register = on => {
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) {
      return next(e)
    }

    const busy = await read($, isBusy)
    const { Box, Button, Text } = $.ui.resolve(e)

    const improve = async () => {
      const { text } = await $.prompt.read()
      if (!text.trim()) {
        $.ui.toast('Écris d’abord un prompt à améliorer')
        return
      }

      await update($, isBusy, () => true)
      try {
        const r = await $.model.complete({
          model: 'sonnet',
          system: SYSTEM,
          prompt: `Prompt à améliorer:\n\n${text}`,
          maxTokens: 2048,
        })
        if (r.isAnswered) {
          await $.prompt.fill({ text: r.text.trim(), mode: 'replace' })
          $.ui.toast('Prompt amélioré ✨')
        } else {
          $.ui.toast(`Échec de l’amélioration (${r.reason})`)
        }
      } finally {
        await update($, isBusy, () => false)
      }
    }

    return (
      <Box>
        {busy ? (
          <Text dimColor>✨ Amélioration en cours…</Text>
        ) : (
          <Button key="improve" label="✨ Améliorer le prompt" onPress={improve} />
        )}
      </Box>
    )
  })
}
