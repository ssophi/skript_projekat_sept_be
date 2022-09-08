const express = require('express');
const bodyParser = require('body-parser')

const jwt =require('jsonwebtoken')
const cors =require('cors');
const bcrypt = require('bcrypt');

const path= require('path');

// const { response } = require('express');
const http = require('http');
const { Server } = require("socket.io");
const history = require('connect-history-api-fallback');
const ruta_user = require('./routes/myuser-routes.js');
const ruta_masaza = require('./routes/masaza_routes.js');
const ruta_trening = require('./routes/trening_routes.js');
const ruta_termin = require('./routes/termin_routes.js');
const ruta_rezervacija = require('./routes/rezervacija_routes.js');


require('dotenv').config();

const app = express();


const PORT = process.env.PORT || 5000;


const server = http.createServer(app);

app.use(express.json());

app.use(bodyParser.json());

var corsOptions = {
    credentials: true,
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// app.use('/admin', adminRoutes)

app.use('/user', ruta_user);
app.use('/masaza',ruta_masaza);
app.use('/trening',ruta_trening);
app.use('/termin',ruta_termin);
app.use('/rezervacija',ruta_rezervacija)

function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
}

function authToken(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];
  
    if (token == null) return res.redirect(301, '/login');
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.redirect(301, '/login');
    
        req.user = user;
    
        next();
    });
}


const io = require("socket.io")(server, {
    // path: '/socket.io',
    cors: {
        origin: "*",
        credentials: true
    },

    origins: ["*"],
    methods: ['GET', 'POST'],
            credentials: true,        
            allowEIO3: true
  });


io.on('connection', socket => {
      
    socket.on('error', err => socket.emit('error', err.message) );
});

const staticMdl = express.static(path.join(__dirname, 'dist'));

app.use(staticMdl);

app.use(history({ index: '/index.html' }));

app.use(staticMdl);

server.listen(process.env.PORT || PORT, () => console.log(`Server running on port ${PORT}`));