// importo l'array dei post
const { title } = require("process");
const posts = require("../data/postData");

// index
function index(req, res) {

    // // inseriamo un errore
    // throw new Error("Errore di test");

    // posts filtrato è uguale ai posts iniziali
    let filteredPosts = posts;

    // se la richiesta contiene un filtro, allora filtriamo i post per tag
    if (req.query.tags) {
        filteredPosts = posts.filter(
            post => post.tags.some(tag => tag.toLowerCase() === req.query.tags.toLowerCase())
        );
    }

    // restituiamo la variabile filteredPosts che potrebbe essere stata filtrata o contenere i posts originali    
    res.json(filteredPosts);
}

// show
function show(req, res) {

    // recuperiamo l'id dall' URL e trasformiamolo in numero
    const id = parseInt(req.params.id)

    // cerchiamo il post tramite id
    const post = posts.find(post => post.id === id);

    // Facciamo il controllo
    if (!post) {

        //Imposto lo status 404
        res.status(404)

        // Restituisco un JSON con le altre informazioni
        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    }
    // Restituiamolo sotto forma di JSON
    res.json(post);
}

// store
function store(req, res) {

    // creo un nuovo id incrementando l'ultimo id presente se non ci sono post assegno 1
    const newId = posts.length === 0 ? 1 : posts[posts.length - 1].id + 1;

    // creo un nuovo oggetto post
    const newPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }

    // aggiungo il nuovo post ai posts
    posts.push(newPost);

    // controllo
    console.log(posts);

    // restituisco lo status corretto e il post appena creato
    res.status(201);
    res.json(newPost);
}

// update
function update(req, res) {

    // recupero l'id dall' URL e trasformiamolo in numero
    const id = parseInt(req.params.id)

    // cerco il post tramite id
    const post = posts.find(post => post.id === id);

    // faccio il controllo
    if (!post) {

        // imposto lo status 404
        res.status(404)

        // restituisco un JSON con le altre informazioni
        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    }

    // aggiorno i valori
    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;

    // log del menu
    console.log(posts);

    // restituisco il post appena aggiornato
    res.json(post)
}

// modify
function modify(req, res) {
    res.send('Modifica parziale del post ' + req.params.id);
}

// destroy
function destroy(req, res) {

    // recuperiamo l'id dall' URL e trasformiamolo in numero
    const id = parseInt(req.params.id)

    // cerchiamo il post tramite id
    const post = posts.find(post => post.id === id);

    // Facciamo il controllo
    if (!post) {

        //Imposto lo status 404
        res.status(404)

        // Restituisco un JSON con le altre informazioni
        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    }

    // Rimuoviamo il post dalla pagina
    posts.splice(posts.indexOf(post), 1);

    // Restituiamo lo status corretto
    res.sendStatus(204)

    // log di riscontro
    console.log(posts);

}

// esporto tutto
module.exports = { index, show, store, update, modify, destroy }