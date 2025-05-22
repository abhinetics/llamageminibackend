import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import Replicate from "replicate"; // Import Replicate
import dotenv from 'dotenv';
dotenv.config();



const app = express();
const port = 5800;

   app.use(cors());
   app.use(express.json());

   const googleApiKey = process.env.GOOGLE_API_KEY; // Replace with your actual API key


  app.post('/api/gemini-generate', async (req, res) => {
       const { text } = req.body;
       // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
       const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
       const geminiHeaders = {
           'Content-Type': 'application/json',
       };
       const prompt = `Analyze the sentiment of the following text and return only one of these labels: 'positive', 'negative', or 'neutral'. Text: ${text}`;

       const geminiBody = JSON.stringify({
           contents: [{
               parts: [{ text: prompt }]
           }]
       });
       try {
           const geminiResponse = await fetch(geminiUrl, {
               method: 'POST',
               headers: geminiHeaders,
               body: geminiBody,
           });
           if (!geminiResponse.ok) {
               const errorData = await geminiResponse.json();
               console.error('Google Gemini API error:', geminiResponse.status, errorData);
               return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
           }
           const geminiData = await geminiResponse.json();
           res.json(geminiData);
       } catch (error) {
           console.error('Error fetching from Google Gemini:', error);
           res.status(500).json({ error: 'Error fetching from Google Gemini' });
       }
       console.log('Received request:', req.body);
   });

//LLAMA -gemini to llama
   app.post('/api/llama-generate', async (req, res) => {
    const { text } = req.body;
    // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
    const geminiHeaders = {
        'Content-Type': 'application/json',
    };
    // const prompt = `Analyze the sentiment of the following text and return only one of these labels: 'positive', 'negative', or 'neutral'. Text: ${text}`;
    const prompt = `<<SYS>>You are a helpful, honest, and concise assistant.<</SYS>>\n\n[INST] Analyze the sentiment of the following text and return 'positive', 'negative', or 'neutral' only:\n\n${text} [/INST]`;

    const geminiBody = JSON.stringify({
        contents: [{
            parts: [{ text: prompt }]
        }]
    });
    try {
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: geminiHeaders,
            body: geminiBody,
        });
        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Google Gemini API error:', geminiResponse.status, errorData);
            return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
        }
        const geminiData = await geminiResponse.json();
        res.json(geminiData);
    } catch (error) {
        console.error('Error fetching from Google Gemini:', error);
        res.status(500).json({ error: 'Error fetching from Google Gemini' });
    }
    console.log('Received request:', req.body);
});

///Bias check endpoint

app.post('/api/gemini-bias', async (req, res) => {
    const { text } = req.body;
    // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
    const geminiHeaders = {
        'Content-Type': 'application/json',
    };
    const prompt = `You are a helpful assistant that detects bias in written content. Return only one word: 'Biased', 'Unbiased', or 'Neutral'. Text: ${text}`;

    const geminiBody = JSON.stringify({
        contents: [{
            parts: [{ text: prompt }]
        }]
    });
    try {
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: geminiHeaders,
            body: geminiBody,
        });
        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Google Gemini API error:', geminiResponse.status, errorData);
            return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
        }
        const geminiData = await geminiResponse.json();
        res.json(geminiData);
    } catch (error) {
        console.error('Error fetching from Google Gemini:', error);
        res.status(500).json({ error: 'Error fetching from Google Gemini' });
    }
    console.log('Received request:', req.body);
});

//LLAMA - gemini to llama
app.post('/api/llama-bias', async (req, res) => {
 const { text } = req.body;
 // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
 const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
 const geminiHeaders = {
     'Content-Type': 'application/json',
 };
 // const prompt = `Analyze the sentiment of the following text and return only one of these labels: 'positive', 'negative', or 'neutral'. Text: ${text}`;
 const prompt = `<<SYS>>You are a helpful, honest, and concise assistant trained to behave like LLaMA 2. You specialize in identifying biased language in text.<</SYS>>

[INST] Analyze the following text and determine if it contains bias. Return only one word: 'Biased', 'Unbiased', or 'Neutral'.

Text: ${text}
[/INST]`;
 const geminiBody = JSON.stringify({
     contents: [{
         parts: [{ text: prompt }]
     }]
 });
 try {
     const geminiResponse = await fetch(geminiUrl, {
         method: 'POST',
         headers: geminiHeaders,
         body: geminiBody,
     });
     if (!geminiResponse.ok) {
         const errorData = await geminiResponse.json();
         console.error('Google Gemini API error:', geminiResponse.status, errorData);
         return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
     }
     const geminiData = await geminiResponse.json();
     res.json(geminiData);
 } catch (error) {
     console.error('Error fetching from Google Gemini:', error);
     res.status(500).json({ error: 'Error fetching from Google Gemini' });
 }
 console.log('Received request:', req.body);
});



///tOXICITY CHECK

app.post('/api/gemini-toxicity', async (req, res) => {
    const { text } = req.body;
    // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
    const geminiHeaders = {
        'Content-Type': 'application/json',
    };
    const prompt = `You are a helpful, honest, and concise assistant. You specialize in identifying the toxicity level of written text.Analyze the following text and classify its toxicity level. Respond with only one of these four labels: 'Non-Toxic', 'Mildly Toxic', 'Moderately Toxic', or 'Highly Toxic'. Text: ${text}`;

    const geminiBody = JSON.stringify({
        contents: [{
            parts: [{ text: prompt }]
        }]
    });
    try {
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: geminiHeaders,
            body: geminiBody,
        });
        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Google Gemini API error:', geminiResponse.status, errorData);
            return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
        }
        const geminiData = await geminiResponse.json();
        res.json(geminiData);
    } catch (error) {
        console.error('Error fetching from Google Gemini:', error);
        res.status(500).json({ error: 'Error fetching from Google Gemini' });
    }
    console.log('Received request:', req.body);
});

//LLAMA - gemini to llama
app.post('/api/llama-toxicity', async (req, res) => {
 const { text } = req.body;
 // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
 const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
 const geminiHeaders = {
     'Content-Type': 'application/json',
 };
 // const prompt = `Analyze the sentiment of the following text and return only one of these labels: 'positive', 'negative', or 'neutral'. Text: ${text}`;
 const prompt = `<<SYS>>You are a helpful, honest, and concise assistant trained to behave like LLaMA 2. You specialize in identifying the toxicity level of written text.<</SYS>>

 [INST] Analyze the following text and classify its toxicity level. Respond with only one of these four labels: 'Non-Toxic', 'Mildly Toxic', 'Moderately Toxic', or 'Highly Toxic'.
 
 Text: ${text}
 [/INST]`;
 
 const geminiBody = JSON.stringify({
     contents: [{
         parts: [{ text: prompt }]
     }]
 });
 try {
     const geminiResponse = await fetch(geminiUrl, {
         method: 'POST',
         headers: geminiHeaders,
         body: geminiBody,
     });
     if (!geminiResponse.ok) {
         const errorData = await geminiResponse.json();
         console.error('Google Gemini API error:', geminiResponse.status, errorData);
         return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
     }
     const geminiData = await geminiResponse.json();
     res.json(geminiData);
 } catch (error) {
     console.error('Error fetching from Google Gemini:', error);
     res.status(500).json({ error: 'Error fetching from Google Gemini' });
 }
 console.log('Received request:', req.body);
});




//Hallucination

app.post('/api/gemini-hallucination', async (req, res) => {
    const { text } = req.body;
    // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
    const geminiHeaders = {
        'Content-Type': 'application/json',
    };
    const prompt = `<<SYS>>You are an expert assistant trained to detect hallucinations in text. A hallucination is a statement that is not supported by real-world facts or evidence. Evaluate the following text and return only one word: 'Factual', 'Hallucinated', or 'Unsure'.<</SYS>>

[INST] Analyze this statement and classify it based on factual accuracy.

Text: ${text}
[/INST]`;

    const geminiBody = JSON.stringify({
        contents: [{
            parts: [{ text: prompt }]
        }]
    });
    try {
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: geminiHeaders,
            body: geminiBody,
        });
        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Google Gemini API error:', geminiResponse.status, errorData);
            return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
        }
        const geminiData = await geminiResponse.json();
        res.json(geminiData);
    } catch (error) {
        console.error('Error fetching from Google Gemini:', error);
        res.status(500).json({ error: 'Error fetching from Google Gemini' });
    }
    console.log('Received request:', req.body);
});

//LLAMA - gemini to llama 2
app.post('/api/llama-hallucination', async (req, res) => {
 const { text } = req.body;
 // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
 const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
 const geminiHeaders = {
     'Content-Type': 'application/json',
 };
 // const prompt = `Analyze the sentiment of the following text and return only one of these labels: 'positive', 'negative', or 'neutral'. Text: ${text}`;
 const prompt = `<<SYS>>You are a LLaMA-style assistant focused on helpfulness, not strict factuality. You analyze whether a statement sounds plausible, imaginative, or factually grounded. Return one of: 'Factual', 'Hallucinated', or 'Unsure'.<</SYS>>

[INST] Review the following content and determine if it is factually correct or possibly hallucinated. Respond with only one word.

Text: ${text}
[/INST]`;

 
 const geminiBody = JSON.stringify({
     contents: [{
         parts: [{ text: prompt }]
     }]
 });
 try {
     const geminiResponse = await fetch(geminiUrl, {
         method: 'POST',
         headers: geminiHeaders,
         body: geminiBody,
     });
     if (!geminiResponse.ok) {
         const errorData = await geminiResponse.json();
         console.error('Google Gemini API error:', geminiResponse.status, errorData);
         return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
     }
     const geminiData = await geminiResponse.json();
     res.json(geminiData);
 } catch (error) {
     console.error('Error fetching from Google Gemini:', error);
     res.status(500).json({ error: 'Error fetching from Google Gemini' });
 }
 console.log('Received request:', req.body);
});


//factuality evaluation

app.post('/api/gemini-factuality', async (req, res) => {
    const { text } = req.body;
    // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
    const geminiHeaders = {
        'Content-Type': 'application/json',
    };
    const prompt = `You are a fact-checking AI assistant trained to evaluate text using verified knowledge and real-world evidence.

    Analyze the following text and classify its factual accuracy. Respond with only one of these labels:
    - 'Factual' (verifiable and accurate)
    - 'Non-Factual' (false or fabricated)
    - 'Unclear' (ambiguous or unverifiable)
    
    Text: "${text}"`;
    


    const geminiBody = JSON.stringify({
        contents: [{
            parts: [{ text: prompt }]
        }]
    });
    try {
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: geminiHeaders,
            body: geminiBody,
        });
        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Google Gemini API error:', geminiResponse.status, errorData);
            return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
        }
        const geminiData = await geminiResponse.json();
        res.json(geminiData);
    } catch (error) {
        console.error('Error fetching from Google Gemini:', error);
        res.status(500).json({ error: 'Error fetching from Google Gemini' });
    }
    console.log('Received request:', req.body);
});

//LLAMA - gemini to llama
app.post('/api/llama-factuality', async (req, res) => {
 const { text } = req.body;
 // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
 const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
 const geminiHeaders = {
     'Content-Type': 'application/json',
 };
 // const prompt = `Analyze the sentiment of the following text and return only one of these labels: 'positive', 'negative', or 'neutral'. Text: ${text}`;
 const prompt = `<<SYS>>You are a helpful and conversational assistant modeled after LLaMA 2. You assess the factuality of a given statement based on general knowledge and plausibility. Use your best judgment to classify the statement.<</SYS>>

 [INST] Review the following text and determine whether it is 'Factual', 'Non-Factual', or 'Unclear'. Reply with just one word.
 
 Text: ${text}
 [/INST]`;
 

 
 const geminiBody = JSON.stringify({
     contents: [{
         parts: [{ text: prompt }]
     }]
 });
 try {
     const geminiResponse = await fetch(geminiUrl, {
         method: 'POST',
         headers: geminiHeaders,
         body: geminiBody,
     });
     if (!geminiResponse.ok) {
         const errorData = await geminiResponse.json();
         console.error('Google Gemini API error:', geminiResponse.status, errorData);
         return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
     }
     const geminiData = await geminiResponse.json();
     res.json(geminiData);
 } catch (error) {
     console.error('Error fetching from Google Gemini:', error);
     res.status(500).json({ error: 'Error fetching from Google Gemini' });
 }
 console.log('Received request:', req.body);
});

//quantitative evaluation

app.post('/api/gemini-quantitative', async (req, res) => {
    const { text } = req.body;
    // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
    const geminiHeaders = {
        'Content-Type': 'application/json',
    };
    const prompt = `<<SYS>>You are a precise and analytical assistant trained to perform quantitative analysis. Given the input text containing numbers, data, or statistical information, extract relevant quantitative insights, perform necessary calculations, and provide a clear summary or result.<</SYS>>

    [INST] Analyze the following text for quantitative data, perform any calculations or statistical analysis required, and provide the quantitative answer or summary.
    
    Text: ${text}
    [/INST]`;
    
    


    const geminiBody = JSON.stringify({
        contents: [{
            parts: [{ text: prompt }]
        }]
    });
    try {
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: geminiHeaders,
            body: geminiBody,
        });
        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Google Gemini API error:', geminiResponse.status, errorData);
            return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
        }
        const geminiData = await geminiResponse.json();
        res.json(geminiData);
    } catch (error) {
        console.error('Error fetching from Google Gemini:', error);
        res.status(500).json({ error: 'Error fetching from Google Gemini' });
    }
    console.log('Received request:', req.body);
});

//LLAMA - gemini to llama
app.post('/api/llama-quantitative', async (req, res) => {
 const { text } = req.body;
 // **CHECK THIS ENDPOINT AND REQUEST BODY AGAINST GOOGLE AI DOCUMENTATION**
 const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`;
 const geminiHeaders = {
     'Content-Type': 'application/json',
 };
 // const prompt = `Analyze the sentiment of the following text and return only one of these labels: 'positive', 'negative', or 'neutral'. Text: ${text}`;
 const prompt = `<<SYS>>You are a helpful and clear assistant modeled after LLaMA 2. You analyze text containing numerical or statistical information and explain the quantitative aspects or calculations in an easy-to-understand way.<</SYS>>

 [INST] Read the following text and explain or analyze the quantitative data or calculations it contains. Provide a clear summary or answer.
 
 Text: ${text}
 [/INST]`;
 
 
 const geminiBody = JSON.stringify({
     contents: [{
         parts: [{ text: prompt }]
     }]
 });
 try {
     const geminiResponse = await fetch(geminiUrl, {
         method: 'POST',
         headers: geminiHeaders,
         body: geminiBody,
     });
     if (!geminiResponse.ok) {
         const errorData = await geminiResponse.json();
         console.error('Google Gemini API error:', geminiResponse.status, errorData);
         return res.status(geminiResponse.status).json({ error: `Google Gemini API error: ${geminiResponse.status}` });
     }
     const geminiData = await geminiResponse.json();
     res.json(geminiData);
 } catch (error) {
     console.error('Error fetching from Google Gemini:', error);
     res.status(500).json({ error: 'Error fetching from Google Gemini' });
 }
 console.log('Received request:', req.body);
});





  
   app.get('/api/test-cors', (req, res) => {
       res.json({ message: 'CORS is working!' });
   });

   app.listen(port, () => {
       console.log(`Server listening on port ${port}`);
   });