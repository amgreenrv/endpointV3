const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('mysql2');
const app = express();

const db = require('./database');
const axios = require('axios');


app.use(express.json());  //adding middlware  
app.use(bodyParser.urlencoded({ extended: false }));


//Current 'database' stand in.
const books = [
    { id: 1, title: 'Book1', author: 'Author1', publisher: 'Publisher1'},
    { id: 2, title: 'Book2', author: 'Author2', publisher: 'Publisher2'},
    { id: 3, title: 'Book3', author: 'Author3', publisher: 'Publisher3'}
];


//Fetch all from mysql database
db.execute('SELECT * FROM books')
    .then(([rows, fieldData]) => {
        console.log(rows);
    })
    .catch(err => {
        console.log(err);
    });

//Get request from google books

const config = {
    method: 'get',
    url: 'https://www.googleapis.com/books/v1/volumes?q=inauthor:nora+roberts',
    headers: { 
    'AIzaSyC_5CEs9GPgydzpcjcA5wNoNjJ4eEsMNsU': ''
    }
};

axios(config)
.then(response => {
    console.log('axios checkpoint') 
    //(JSON.stringify(response.data));
})
.catch(err => {
    console.log(err);
});

//Get request for /
app.get('/', (req, res) => {
    res.send('No Books Match Your Search.');
});


//Get request for all books
app.get('/books',  (req, res) => {

});


//Poor attempt to move api data into mysql.
//    config.execute('INSERT INTO books (title, author, publisher) VALUES (?, ?, ?)',
//   [this.title, this.author, this.publisher]
//   );

//Post request for books database
app.post('/books', (req, res) => {
    const book = {
        id: books.length +1, //id will be assigned by database
        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher
    };
    books.push(book);
    res.send(book); //client needs to do new post id.
});


//Get request for all books with single author.
app.get('/:author', async (req, res) => {
    const query = "SELECT * FROM books WHERE author = ?";
    db.query(query, [ req.params.author], (error, results) => {
        if (!results[0]) {
            res.json({ status: "Not Found!" });
        } else {
            res.json(results[0]);
        }
    }); 

    //find method for specific author param
    //const book = books.find(b => b.author == req.params.author);
    //404
    //if (!book) res.status(404).send('No books found.');
    //res.send(book);
});


//Server port.
const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}...`));