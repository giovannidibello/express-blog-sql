// importo express 
const express = require('express');
const app = express();
const port = 3000;
const cors = require("cors");

// importo il file delle rotte
const postsRouter = require('./routers/postRouter');

// middleware file statici cartella public
app.use(express.static('public'));

// middleware CORS
app.use(cors());

// registro il body-parser
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Server del mio blog")
})

// richiamo il file delle rotte
app.use("/posts", postsRouter)

app.listen(port, () => {
    console.log(`Esempio di applicazione in ascolto sulla porta ${port}`)
})