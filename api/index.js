import express, { json } from 'express';
import cors from 'cors';
import FormData from 'form-data';
import fetch from 'node-fetch';
import dotenv from 'dotenv/config';

const app = express();

app.use(cors());

app.use(express.json());

const API_KEY = process.env.VYRO_API_KEY;
const PORT = process.env.PORT || 5000;

app.get('/', (req, res)=>{
    res.send('Hello from the backend!');
})

app.post('/api/generate-image', async(req, res)=>{
    try {
        const {prompt, style, aspect_ratio, seed} = req.body;

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('style', style);
        formData.append('aspect_ratio', aspect_ratio);
        formData.append('seed', seed);

        const apiResponse = await fetch("https://api.vyro.ai/v2/image/generations", {
            method: 'POST',
            headers:{
                Authorization: `Bearer ${API_KEY}`,
            },
            body: formData,
        });

        if(!apiResponse.ok){
            const errorText = await apiResponse.text();
            return res.status(apiResponse.status).json({error: errorText});
        }

        const imageBuffer = await apiResponse.buffer();
        console.log(imageBuffer);
        
        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error("Error in /api/generate-image:", err);
        res.status(500).json({ error: err.toString() });
    }
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})