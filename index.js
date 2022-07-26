const express = require("express");
const passport = require('passport');
const session = require("express-session");
require('./auth');

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate With Google</a>');
});

app.get('/auth/google', 
  passport.authenticate('google', {scope: ['email', 'profile']})
);

app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  })
);

app.get('/auth/failure', (req, res) => {
  res.send('Un truc ne va pas');
});

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Bien le bonjour ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.send('Au revoir');
})

app.listen(3000, () => console.log("listening on : 3000"));
