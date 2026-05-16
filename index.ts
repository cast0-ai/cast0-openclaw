import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";

const BASE_URL = "https://api.cast0.ai";

export default definePluginEntry({
  id: "cast0",
  name: "cast0",
  description: "Turn agent output into podcast episodes.",

  register(api) {
    const cfg = api.config as { apiKey: string };

    const headers = () => ({
      Authorization: `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
    });

    api.registerTool({
      name: "create_episode",
      description:
        "Create a cast0 podcast episode from text. The text is read verbatim by TTS — not interpreted as a prompt. Returns immediately with a queued episode id. Poll get_episode until status is 'done' to get the audio URL. Episodes auto-publish to the podcast RSS feed.",
      parameters: Type.Object({
        title: Type.String({ description: "Episode title." }),
        text: Type.String({
          description: "Text content to convert to audio. Read verbatim by TTS.",
        }),
      }),
      async execute(_id, { title, text }) {
        const res = await fetch(`${BASE_URL}/episodes`, {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({ title, text }),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            content: [{ type: "text", text: `Error ${res.status}: ${data.error ?? JSON.stringify(data)}` }],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });

    api.registerTool({
      name: "get_episode",
      description:
        "Get a cast0 episode by id. Poll until status is 'done' to access the audio URL. Status values: queued, processing, done, failed.",
      parameters: Type.Object({
        id: Type.String({ description: "Episode id returned by create_episode." }),
      }),
      async execute(_id, { id }) {
        const res = await fetch(`${BASE_URL}/episodes/${encodeURIComponent(id)}`, {
          headers: headers(),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            content: [{ type: "text", text: `Error ${res.status}: ${data.error ?? JSON.stringify(data)}` }],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });

    api.registerTool({
      name: "list_episodes",
      description: "List all cast0 episodes for this podcast, newest first.",
      parameters: Type.Object({}),
      async execute(_id, _params) {
        const res = await fetch(`${BASE_URL}/episodes`, {
          headers: headers(),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            content: [{ type: "text", text: `Error ${res.status}: ${data.error ?? JSON.stringify(data)}` }],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });
  },
});
