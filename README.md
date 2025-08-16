# Duolingo Discord Rich Presence

Show your **Duolingo streak, XP, and language** directly in your **Discord profile** with Rich Presence.
Runs locally, no bots required — your friends will see it just like a game status.

# Features

Displays your learning language, level, XP, and 🔥 streak.

Updates automatically every 30 seconds.

Uses Discord Rich Presence (visible on desktop profile).

Custom app icon + optional custom images (from Discord Developer Portal).

# Requirements

Discord Desktop App (Rich Presence doesn’t work in browser).

Windows 10/11.

Your own Discord Application Client ID (free, see below).

Your Duolingo username.

# Setup Instructions
1. Create a Discord Application

Go to Discord Developer Portal.

Click New Application → name it (e.g., Duolingo RPC).

Copy the Client ID (you’ll need this later).

Go to Rich Presence → Art Assets:

Upload an image for the main logo → name it duo_large.

(Optional) Upload a streak icon → name it streak.

Save changes.

# 2. First Run

Make sure Discord desktop app is running and logged into your account.

Double-click duo-rpc.exe.

The first time you run it, it will ask:

Your Duolingo username.

Your Discord Client ID.
These are saved to config.json in the same folder so you won’t have to re-enter them.

# 3. Enjoy

Your Discord profile will now show:

```lua
Learning Spanish

5400 XP • 12🔥
```

It updates automatically every 30 seconds.

Close the console window to stop it.
