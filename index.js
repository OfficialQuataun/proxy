import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// Helper: fetch data from Roblox APIs
async function fetchRobloxAPI(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "RobloxProxy/1.0 (by @FederalNando)",
      "Accept": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Roblox API error (${res.status}): ${text}`);
  }
  return res.json();
}

// 🔹 Route 1: Get user's universes
app.get("/games/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cursor = req.query.cursor || "";
    const url = `https://games.roblox.com/v2/users/${userId}/games?limit=50&cursor=${cursor}`;
    const data = await fetchRobloxAPI(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Route 2: Get game passes for a universe
app.get("/gamepasses/:universeId", async (req, res) => {
  try {
    const { universeId } = req.params;
    const { pageToken = "" } = req.query;
    const url = `https://apis.roblox.com/game-passes/v1/universes/${universeId}/game-passes?passView=Full&pageSize=50&pageToken=${pageToken}`;
    const data = await fetchRobloxAPI(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Route 3: Get creator’s catalog assets
app.get("/catalog/:creatorId", async (req, res) => {
  try {
    const { creatorId } = req.params;
    const cursor = req.query.cursor || "";
    const url = `https://apis.roblox.com/marketplace-items/v1/items?creatorTargetId=${creatorId}&creatorType=User&limit=30&cursor=${cursor}`;
    const data = await fetchRobloxAPI(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Roblox API Proxy is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
