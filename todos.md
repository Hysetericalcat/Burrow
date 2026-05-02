# Burrow — Project Todos

> Self-hosted ngrok alternative. Tunnel localhost to a public VPS over WebSocket.
> **Deadline: Monday**

---

## FRIDAY — Core Tunnel Working

**Goal:** `burrow --port 3000` on laptop → hit VPS IP from phone → local app responds

### Setup
- [ ] Create GitHub repo named `burrow`
- [ ] Scaffold folder structure — `server/` and `client/`
- [ ] Init `package.json` in both, install `ws` library
- [ ] Create `.env.example` files for both

### Learning (do before coding)
- [ ] Build a raw TCP echo server with `net` module (~20 lines)
- [ ] Read ngrok blog post — `ngrok.com/blog/how-ngrok-works`
- [ ] Understand control channel vs data channel concept

### Server (runs on VPS)
- [ ] WebSocket server that accepts client agent connections
- [ ] TCP server that listens on a public port (e.g. 8080)
- [ ] Assign a connection ID to each incoming public TCP connection
- [ ] Forward raw bytes from public TCP → WebSocket → client agent

### Client Agent (runs on laptop)
- [ ] Connect to VPS WebSocket server on startup
- [ ] Receive bytes from WebSocket
- [ ] Forward bytes to `localhost:PORT`
- [ ] Send response bytes back through WebSocket → VPS → public TCP

### End to End Test
- [ ] Run a simple Express app on `localhost:3000`
- [ ] Run client agent pointing to that port
- [ ] Hit `VPS_IP:8080` from phone on mobile data
- [ ] Confirm response comes from local app

---

## SATURDAY — Polish + VPS Deployment

**Goal:** Burrow running live on Oracle VPS, accessible from anywhere

### VPS Setup
- [ ] Spin up Oracle Cloud free tier VPS (Ubuntu 22.04)
- [ ] SSH in with key pair
- [ ] Run `ufw allow 22`, `ufw allow 8080`, `ufw enable`
- [ ] Install Node.js on VPS
- [ ] Install PM2 globally — `npm i -g pm2`

### Deploy Server
- [ ] Copy server code to VPS (scp or git clone)
- [ ] Set environment variables on VPS
- [ ] Start server with PM2 — `pm2 start server.js`
- [ ] Run `pm2 save` + `pm2 startup` so it survives reboots
- [ ] Verify with `netstat -tulpn` that ports are open

### Robustness
- [ ] Handle client agent disconnect gracefully on server
- [ ] Auto-reconnect logic on client agent (exponential backoff)
- [ ] Heartbeat — ping/pong every 30s to detect stale tunnels
- [ ] Clean up dead tunnel mappings on server

### CLI
- [ ] Add `--port` flag — `burrow --port 3000`
- [ ] Add `--server` flag — `burrow --server ws://VPS_IP:9000`
- [ ] Show connected message with public URL on startup

### Testing
- [ ] Test tunnel from a completely different network (mobile data)
- [ ] Kill client agent mid-session, verify reconnect works
- [ ] Run two tunnels simultaneously, verify no cross-talk

---

## SUNDAY — README + Demo + Cleanup

**Goal:** Repo looks legit. Someone can clone and run it in 5 minutes.

### Code Cleanup
- [ ] Remove all `console.log` debug statements
- [ ] Add comments explaining *why*, not *what*
- [ ] Consistent error handling across server and client
- [ ] Add graceful shutdown — handle `SIGTERM`, close connections cleanly

### README
- [ ] Project name + one-line description
- [ ] ASCII architecture diagram
- [ ] How to deploy server on VPS (step by step)
- [ ] How to install and run client agent
- [ ] "How it works" section — explain tunnel flow simply
- [ ] Requirements section (Node version, etc.)

### Demo
- [ ] Record GIF — show `localhost:3000` tunneled live
- [ ] Add GIF to README

### Optional (if time permits)
- [ ] `docker-compose.yml` for server deployment
- [ ] `npm install -g burrow` installable CLI setup (`bin` in package.json)
- [ ] nip.io subdomain for cleaner public URL

### Final
- [ ] Review repo on GitHub — looks clean?
- [ ] Check all files committed, no secrets in code
- [ ] Share repo link

---

## MONDAY — Buffer

- [ ] Fix anything broken from Sunday
- [ ] Final README pass
- [ ] Done ✓

## Multiplexing Protocol (Makes it Resume Worthy)

### Protocol Design
- [ ] Design binary frame format — `[2 bytes: connection ID][4 bytes: payload length][N bytes: payload]`
- [ ] Write `encodeFrame(connectionId, data)` — packs bytes into protocol format
- [ ] Write `decodeFrame(buffer)` — unpacks incoming bytes back into connectionId + data

### Server Changes
- [ ] Assign a unique connection ID to every incoming public TCP connection
- [ ] Wrap bytes with connection ID before sending through shared WebSocket
- [ ] Maintain a map — `connectionId → publicSocket` for routing responses back

### Client Agent Changes
- [ ] Single WebSocket connection to VPS (not one per tunnel)
- [ ] On receiving a frame — unwrap connection ID, forward data to localhost
- [ ] Wrap response bytes with same connection ID before sending back

### Dashboard (Next.js)
- [ ] Show active tunnels in real time
- [ ] Show live requests coming through
- [ ] Show bytes transferred per tunnel

### CLI Polish
- [ ] Show tunnel URL on connect
- [ ] Show live request log in terminal
- [ ] Handle `--server` and `--port` flags