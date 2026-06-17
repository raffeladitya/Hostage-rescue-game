# Hostage & Rescue

A private HTML5 game prototype based on the multimedia proposal. It uses Phaser with a small local Node server, with all game graphics generated in code so it can run locally without public deployment.

## Run locally

```powershell
npm install --cache .\.npm-cache --ignore-scripts
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://127.0.0.1:5173
```

## Run privately on the same Wi-Fi

```powershell
npm run dev:lan
```

The server will show a Network URL such as:

```text
http://192.168.x.x:5173
```

Only people on the same Wi-Fi/network can open that address. This is not deployed to a public website.

## Private online options without public deployment

Use one of these when your tester is not on the same Wi-Fi:

- VS Code Live Share: best for class/project review because access is invite-based.
- Tailscale: best for private testing between your own devices.
- Cloudflare Tunnel or ngrok with access protection: useful for temporary demos, but only if you enable authentication or share the URL carefully.

## Controls

- `WASD` or arrow keys: move
- `E`: interact with computers, evidence, hostage, and exit
- Avoid guard and CCTV vision.
- If CCTV scans you, all guards chase you for a few seconds.
- If a guard sees you, that guard follows you.
- If a guard catches you for 2 seconds, the mission fails.
- Collect evidence, hack CCTV, rescue the hostage, then reach the exit.

## Check project files

```powershell
npm run check
```

## Notes

The game loads Phaser from `vendor/phaser.min.js`, so it does not need a public CDN while running locally.
