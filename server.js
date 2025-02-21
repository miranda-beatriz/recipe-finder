const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "recipes.json";

app.use(express.static("public"));
app.use(express.json());

app.get("/api/recipes", async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: "error" });
    }

    const appId = process.env.APP_ID;
    const appKey = process.env.APP_KEY;
    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${appId}&app_key=${appKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error when searching for recipes");
        const data = await response.json();
        res.json(data.hits);
    } catch (error) {
        console.error("Error when searching for recipes:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/random-recipe", async (req, res) => {
    const appId = process.env.APP_ID;
    const appKey = process.env.APP_KEY;
    const categories = ["dinner", "dessert", "breakfast", "snack", "lunch"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${randomCategory}&app_id=${appId}&app_key=${appKey}`;

    try {
        console.log("Looking for recipes to select a random one...");
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error when searching for recipes");
        const data = await response.json();
        if (!data.hits || data.hits.length === 0) return res.status(404).json({ error: "No recipes found" });
        
        const randomRecipe = data.hits[Math.floor(Math.random() * data.hits.length)];
        res.json(randomRecipe);
    } catch (error) {
        console.error("Error when searching for random recipe:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/favorites", (req, res) => {
    const { recipe } = req.body;
    if (!recipe) return res.status(400).json({ error: "error" });

    let recipes = [];
    if (fs.existsSync(DATA_FILE)) {
        recipes = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    
    recipes.push(recipe);
    fs.writeFileSync(DATA_FILE, JSON.stringify(recipes, null, 2));
    res.json({ message: "Recipe saved successfully!" });
});

app.get("/api/favorites", (req, res) => {
    if (!fs.existsSync(DATA_FILE)) return res.json([]);
    const recipes = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(recipes);
});

app.delete("/api/favorites", (req, res) => {
    const { label } = req.body;
    if (!label) return res.status(400).json({ error: "Recipe name required" });
    
    if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ error: "No recipes found" });
    let recipes = JSON.parse(fs.readFileSync(DATA_FILE));
    recipes = recipes.filter(recipe => recipe.label !== label);
    fs.writeFileSync(DATA_FILE, JSON.stringify(recipes, null, 2));
    res.json({ message: "Recipe successfully removed" });
});

app.post("/api/rate", (req, res) => {
    const { label, rating } = req.body;
    if (!label || rating === undefined || rating < 0 || rating > 5) {
        return res.status(400).json({ error: "error" });
    }

    if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ error: "No recipes found" });
    let recipes = JSON.parse(fs.readFileSync(DATA_FILE));
    
    recipes = recipes.map(recipe => recipe.label === label ? { ...recipe, rating } : recipe);
    fs.writeFileSync(DATA_FILE, JSON.stringify(recipes, null, 2));
    res.json({ message: "Registered evaluation" });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
