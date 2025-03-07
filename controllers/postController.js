// importo il file di connessione al database
const connection = require('../data/db');

// index
function index(req, res) {

    // preparo la query
    const sql = 'SELECT * FROM posts';

    // eseguo la query
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
}

// show
function show(req, res) {

    // recupero l'id dall' URL e trasformiamolo in numero
    const id = parseInt(req.params.id)

    // preparo la query per il post
    const postSql = 'SELECT * FROM posts WHERE id = ?';

    // preparo la query per i tags con una join e Where
    const tagsSql = `
    SELECT tags.*
    FROM tags
    JOIN post_tag ON tags.id = post_tag.tag_id
    WHERE post_tag.post_id = ?
    `;

    // query per il post
    connection.query(postSql, [id], (err, postResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (postResults.length === 0) return res.status(404).json({ error: 'Post not found' });

        // recupero il post
        const post = postResults[0];

        // se è andata bene, eseguiamo la seconda query per i tags
        connection.query(tagsSql, [id], (err, tagResults) => {
            if (err) return res.status(500).json({ error: 'Database query failed' });

            // aggiungo i tags al post
            post.tags = tagResults;
            res.json(post);
        });
    });
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

    //elimino il post dal database
    connection.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete post' });
        res.sendStatus(204)
    });

}

// esporto tutto
module.exports = { index, show, store, update, modify, destroy }