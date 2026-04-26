const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const csrf = require('csurf');

const app = express();
app.use(bodyParser.json());
app.use(session({
  name: 'shop.session.id',
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: {
    domain: undefined,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production'
  }
}));
app.use(csrf({ cookie: true }));

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
