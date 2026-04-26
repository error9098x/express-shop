const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: 'shop-secret',
  resave: false,
  saveUninitialized: true
}));

// Vulnerability 1: Price manipulation - client-side price
app.post('/checkout', (req, res) => {
  const { items, totalPrice } = req.body;
  
  // Trusting client-provided price without server-side validation
  processPayment(totalPrice);
  
  res.json({ message: 'Order placed', total: totalPrice });
});

// Vulnerability 2: Session fixation
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Not regenerating session ID after login
  req.session.user = username;
  
  res.json({ message: 'Logged in' });
});

function processPayment(amount) {
  console.log(`Processing payment: $${amount}`);
}

app.listen(3000, () => {
  console.log('Shop running on port 3000');
});
