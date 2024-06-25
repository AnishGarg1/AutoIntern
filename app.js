const express = require("express");
const startAutoApply = require(".");
const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send(`
        <html>
            <head>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background: #f0f2f5;
                    }
                    .container {
                        text-align: center;
                        background: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .container div {
                        font-size: 24px;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .container button {
                        padding: 10px 20px;
                        font-size: 16px;
                        color: #fff;
                        background: #007bff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                    }
                    .container button:hover {
                        background: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div>Apply to Your Job Instantly</div>
                    <form action="/start" method="POST">
                        <button type="submit">Start Applying</button>
                    </form>
                </div>
            </body>
        </html>
    `)
})

app.post('/start', async (req, res) => {
    try {
        await startAutoApply();
        res.send("Application process started.")
    } catch (error) {
        console.log("Error:", error);
    }
})

app.listen(port, (req, res) => {
    console.log(`App is listening on port: ${port}`);
})