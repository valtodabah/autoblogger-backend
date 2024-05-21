const express = require("express");
const cors = require('cors');

const app = express();

// Enable All CORS Requests
app.use(cors());

require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
});

app.use(express.json());

app.post("/generate-article", async(req, res) => {
    console.log("RESPONSE: ",req.body);
    if(req.body.prompt){
    try {
        const prompt = req.body.prompt; // Extract prompt from request body
        
        response = await openai.chat.completions.create({
            messages: [{ role: "system", content: `Create an article that suits the following title (create it in the language that is written): ${prompt}` }],
            model: "gpt-3.5-turbo",
            max_tokens: 1000,
          });

        console.log(response.choices[0].message.content);

        return res.status(200).json({
            success: true,
            data: response.choices[0],
        });
    } catch(error) {
        console.log("Entered catch");
        console.log(error);
        return response = res.status(500).json({
            success: false,
            error: error.message || "There was an issue on the server",
        });
    }
}
else{
    console.log("There is no prompt.");
}
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));