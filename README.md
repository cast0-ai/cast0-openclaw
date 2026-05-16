# cast0: Turn Text into a Published Podcast

Give your AI a voice. This plugin lets OpenClaw agents create podcast episodes via [cast0](https://cast0.ai). One tool call: text in, episode in your feed.

Your AI writes a briefing. You listen to it on your commute. No reading required.

---

## Install

```bash
openclaw plugins install clawhub:@cast0/openclaw-plugin-cast0
```

Then configure your API key (get one at [cast0.ai](https://cast0.ai)):

```bash
openclaw plugins config cast0 set apiKey pk_xxxxx
openclaw gateway restart
```

---

## Tools

### `create_episode`

Creates a podcast episode from text. The text is read verbatim by TTS: your AI writes the script, cast0 reads it. Returns immediately with a queued episode id.

| Parameter | Type | Description |
|---|---|---|
| `title` | string | Episode title |
| `text` | string | Text to convert to audio. Read verbatim. |

Response: `{ id, status: "queued" }`

Episodes auto-publish to your RSS feed when processing completes. Subscribe once in Apple Podcasts, Spotify, or any podcast app — episodes appear automatically.

---

### `get_episode`

Fetches the current state of an episode. Poll until `status` is `done` to get the audio URL.

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Episode id from `create_episode` |

Response: `{ id, title, status, audioUrl? }`

Status values: `queued`, `processing`, `done`, `failed`.

---

### `list_episodes`

Lists all episodes for this podcast, newest first.

No parameters.

Response: array of `{ id, title, status, audioUrl? }`

---

## Example agent prompt

```
Summarize today's Hacker News top 10 and publish it as a cast0 episode titled "HN Digest".
Poll until the episode is done, then tell me the audio URL.
```

---

## What cast0 handles for you

- Text-to-speech with your configured voice and model
- Long-text chunking with no duration limits
- Audio hosting
- RSS feed publishing to Apple Podcasts, Spotify, and everywhere else

You pay for the episode. Never for the infrastructure.

---

## Links

- [cast0.ai](https://cast0.ai)
- [API docs](https://cast0.ai/docs)
