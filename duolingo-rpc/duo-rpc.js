const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const RPC = require('discord-rpc');
const readline = require('readline');

const configPath = path.join(__dirname, 'config.json');

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

async function loadConfig() {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } else {
    const DUO_USER = await ask('Enter your Duolingo username: ');
    const DISCORD_CLIENT_ID = await ask('Enter your Discord Application Client ID: ');
    const cfg = { DUO_USER, DISCORD_CLIENT_ID };
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
    return cfg;
  }
}

async function fetchDuolingoProfile(username) {
  const url = `https://www.duolingo.com/users/${encodeURIComponent(username)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Duolingo fetch failed: ${res.status}`);
  return res.json();
}

function buildActivity(profile, username) {
  const streak = profile.site_streak ?? 0;
  const langKey = Object.keys(profile.language_data || {})[0] || 'Duolingo';
  const langData = profile.language_data[langKey] || {};
  const level = langData.level ?? '?';
  const points = langData.points ?? 0;

  return {
    details: `Learning ${langKey}`,
    state: `Lvl ${level} • ${points} XP • ${streak}🔥`,
    largeImageKey: 'duo_large',
    largeImageText: `${points} XP`,
    smallImageKey: streak > 0 ? 'streak' : undefined,
    smallImageText: streak > 0 ? `${streak} day streak` : undefined,
    startTimestamp: Date.now(),
    instance: false
  };
}

async function main() {
  const { DUO_USER, DISCORD_CLIENT_ID } = await loadConfig();
  RPC.register(DISCORD_CLIENT_ID);
  const rpc = new RPC.Client({ transport: 'ipc' });

  let lastActivity = null;

  async function updateLoop() {
    try {
      const profile = await fetchDuolingoProfile(DUO_USER);
      const activity = buildActivity(profile, DUO_USER);
      if (JSON.stringify(activity) !== JSON.stringify(lastActivity)) {
        rpc.setActivity(activity);
        lastActivity = activity;
        console.log('Updated:', activity.details, activity.state);
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }

  rpc.on('ready', () => {
    console.log('Rich Presence connected.');
    updateLoop();
    setInterval(updateLoop, 30_000);
  });

  rpc.login({ clientId: DISCORD_CLIENT_ID }).catch(console.error);
}

main();
