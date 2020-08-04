'use strict';

const express = require('express');

const app = express();
app.set('view engine', 'ejs');

// Middleware!
// Wire up static files from public folder
app.use(express.static('./public'));
// Handle POST body from forms!
app.use(express.urlencoded({ extended: true }));
// AJAX might POST a body with JSON in it
app.use(express.json());

// Normally user would come from Authentication
const user = { username: 'dahlbyk' }

// Page Routes
app.get('/', (request, response) => {
  let viewModel = {
    user,
  }
  response.render('index', viewModel);
})

app.get('/list', (request, response) => {
  // TODO: get from database
  let list = ['apples','bananas','kiwi'];

  let viewModel = {
    user,
    productList: list,
  }
  response.render('list', viewModel);
})

// TODO: get from database
let cart = [
  { product: 'apples', quantity: 5, price: .5 },
  { product: 'bananas', quantity: 8, price: .25 },
];
app.get('/cart', (request, response) => {
  let viewModel = {
    user,
    cart, // same as cart: cart,
    total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
  };
  response.render('cart', viewModel);
})

app.get('/checkout', (request, response) => {
  let viewModel = {
    user,
  };
  response.render('checkout', viewModel);
})

app.get('/order', (request, response) => {
  console.log('query', request.query); // info from the query string

  // save order data into Postgres

  let viewModel = {
    orderAddress: request.body
  }
  response.render('thanks', viewModel);
})

app.post('/order', (request, response) => {
  console.log('query', request.query); // info from the query string
  console.log('body', request.body); // info from the request body

  // save order data into Postgres

  // if (request.body.zip does not match regex) { 
  //   res.status(400)// etc
  // }

  let viewModel = {
    orderAddress: request.body
  }
  response.render('thanks', viewModel);
})

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));