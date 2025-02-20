const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static("public"));

app.get("/api/recipes", async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: "A consulta é obrigatória" });
    }

    const appId = process.env.APP_ID;
    const appKey = process.env.APP_KEY;
    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${appId}&app_key=${appKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao buscar receitas");

        const data = await response.json();
        res.json(data.hits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
