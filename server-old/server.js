const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 5173;

app.use(cors());

app.use(express.static(path.resolve(__dirname, '../portfolio/dist')));

app.get("/api/dexscreener/:chainId/:tokenAddresses", async (req, res) => {
    const { chainId, tokenAddresses } = req.params;

    try {
        const response = await fetch(`https://api.dexscreener.com/tokens/v1/${chainId}/${tokenAddresses}`, {
            method: 'GET',
        });
        //Check error ?
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`));