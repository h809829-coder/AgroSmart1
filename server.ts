import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database("agro_smart.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS crops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    soil_type TEXT,
    season TEXT,
    water_requirement TEXT,
    budget TEXT,
    fertilizer TEXT,
    irrigation_schedule TEXT,
    expected_yield TEXT
  );

  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT,
    soil_type TEXT,
    season TEXT,
    water_availability TEXT,
    budget TEXT,
    recommended_crop TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const cropCount = db.prepare("SELECT COUNT(*) as count FROM crops").get() as { count: number };
if (cropCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO crops (name, soil_type, season, water_requirement, budget, fertilizer, irrigation_schedule, expected_yield)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const sampleCrops = [
    ["Rice", "Clay", "Kharif", "High", "Medium", "Urea, DAP", "Every 2-3 days", "4-6 tons/hectare"],
    ["Wheat", "Loamy", "Rabi", "Medium", "Medium", "NPK, Urea", "Every 10-15 days", "3-5 tons/hectare"],
    ["Cotton", "Black", "Kharif", "Medium", "High", "DAP, Potash", "Every 15-20 days", "2-3 tons/hectare"],
    ["Groundnut", "Red", "Kharif", "Low", "Low", "Gypsum, SSP", "Every 10 days", "1.5-2.5 tons/hectare"],
    ["Maize", "Sandy", "Kharif", "Medium", "Low", "Nitrogen, Zinc", "Every 7-10 days", "5-8 tons/hectare"],
    ["Mustard", "Sandy", "Rabi", "Low", "Low", "Sulphur, Urea", "Every 20 days", "1-2 tons/hectare"],
    ["Sugarcane", "Loamy", "Zaid", "High", "High", "Organic Manure, NPK", "Every 10-12 days", "70-100 tons/hectare"],
    ["Moong Dal", "Sandy", "Zaid", "Low", "Low", "Phosphorus", "Every 15 days", "0.5-1 ton/hectare"]
  ];

  sampleCrops.forEach(crop => insert.run(...crop));
}

app.use(express.json());

// API Routes
fetch("/api/recommend", {
  method: "POST",
}){
  const { location, soilType, season, waterAvailability, budget } = req.body;

  // Simple rule-based logic
  const stmt = db.prepare(`
    SELECT * FROM crops 
    WHERE soil_type = ? AND season = ? AND water_requirement = ? AND budget = ?
    LIMIT 1
  `);
  
  let crop = stmt.get(soilType, season, waterAvailability, budget) as any;

  // Fallback if no exact match
  if (!crop) {
    crop = db.prepare(`
      SELECT * FROM crops 
      WHERE soil_type = ? OR season = ?
      ORDER BY RANDOM() LIMIT 1
    `).get(soilType, season) as any;
  }

  if (crop) {
    db.prepare(`
      INSERT INTO recommendations (location, soil_type, season, water_availability, budget, recommended_crop)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(location, soilType, season, waterAvailability, budget, crop.name);
  }

  res.json({
    success: true,
    recommendation: crop || {
      name: "General Mixed Crops",
      fertilizer: "Organic Compost",
      irrigation_schedule: "As per local rainfall",
      expected_yield: "Variable"
    }
  });
});

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    // Return mock data if no API key
    return res.json({
      main: { temp: 28, humidity: 65 },
      weather: [{ main: "Clear", description: "sunny day" }],
      alerts: ["No active alerts. Good for harvesting."]
    });
  }

  try {
    const response = await fetch("/api/weather?lat=...&lon=...")
    const data = await response.json();
    res.json({
      ...data,
      alerts: data.main.temp > 35 ? ["Heatwave warning! Increase irrigation."] : ["Normal weather conditions."]
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/api/history", (req, res) => {
  const history = db.prepare("SELECT * FROM recommendations ORDER BY timestamp DESC LIMIT 10").all();
  res.json(history);
});

app.get("/api/crop/:name", (req, res) => {
  const crop = db.prepare("SELECT * FROM crops WHERE name = ?").get(req.params.name);
  if (crop) {
    res.json(crop);
  } else {
    res.status(404).json({ error: "Crop not found" });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running");
});
