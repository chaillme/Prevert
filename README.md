# Prevert

Mod Claude Code : ajoute un bouton **✨ Améliorer le prompt** au-dessus de la zone de saisie.
Au clic, le brouillon est reformulé par Sonnet (clair, précis, même intention et même langue) et remplace le texte dans la zone de saisie, sans être envoyé.

## Utilisation

```bash
claude --plugin-dir <chemin vers ce dossier>
```

Le modèle et les consignes de reformulation se règlent dans `hooks/register.tsx`.
