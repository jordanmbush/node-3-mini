const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const session = require('express-session');
require('dotenv').config();
const { createInitialSession } = require('./middlewares/session');
const filter = require('./middlewares/filter');

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );

app.use( session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // TWO WEEKS
        age: 10000
    }
}))

app.use( createInitialSession );

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, filter, mc.create );
app.get( messagesBaseUrl, mc.read );
app.get( `${messagesBaseUrl}/history`, mc.history );
app.put( `${messagesBaseUrl}`, filter, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );
