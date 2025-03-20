const path = require('path');
const express = require('express'); // It will rerturn function
const app = express();
const hbs = require('hbs');

// Both Variables available in Main wrapper function of Node JS script
// console.log(__dirname); // path of current directory
// console.log(__filename); // path of current file

// Static path setup to serve html, js, css, images etc. 
const publiDirPath = path.join(__dirname, '../public');
app.use(express.static(publiDirPath));

// Setting uo handlebars View Engine in Express and views folder location
// By default hbs files should be in views folder and it should be in root folder.
app.set('view engine', 'hbs'); // setting view engine as handlebars to integrate dynamic template in Express.
const viewsDirPath = path.join(__dirname, '../templates/views');
app.set('views', viewsDirPath);

// Partials (part of some webpage that will be used in multiple hbs eg: header, footer etc).
// Setting Up Partials folder and load reusbale templates in multiple places.
const partialsDirPath = path.join(__dirname, '../templates/partials');
hbs.registerPartials(partialsDirPath);

app.get('', (req, res) => {
    res.render('index', {
        title: 'Index HBS', // to load index hbs page delete index.html from public
        name: 'Ajitkumar'
    });
});
app.get('/about', (req, res) => {
    res.render('about', {  // Route to load dynamic template.
        title: 'About HBS', // passing inputs to dynamic rendering templates
        name: 'Ajitkumar'
    });
});
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help HBS',
        name: 'Ajitkumar'
    });
});

// app.get('', (req, res) => {
//     res.send('Hello Express!');
// });

// app.get('/help', (req, res) => {
//     res.send('Help Page Loaded!');
// });

// app.get('/about', (req, res) => {
//     // res.send('About Page Loaded!');
//     res.send('<h1>About Page Loaded!</h1>'); // Send HTML
// });

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'You Must Provide address' }); // return will break the function.
    }
    res.send([
        {
            location: 'RJPM',
            forecast: '50 deg'
        },
        {
            location: 'CBE',
            forecast: '40 deg'
        }
    ]); // Send OBJ --> Express will strigify and send JSON response to Client/Browser
});

app.get('/help/*', (req, res) => { // pattern using wild card route path
    res.send('Help Article not Found'); // we can use hbs to render dynamic template here
});

app.get('*', (req, res) => { // wild card route
    res.send('Page not Found'); // we can use hbs to render dynamic template here
});

app.listen(3000, () => {
    console.log('Server Started on Port 3000!');
});

// nodemon src/app.js -e js,hbs // to run other extensions like hbs



// Summary of Key Methods
// Method	    Purpose
// app.use	    Mounts middleware or serves static files.
// app.set	    Assigns settings (e.g., view engine, views directory, env).
// app.get	    Handles GET requests or retrieves settings.
// app.post	    Handles POST requests.
// app.put	    Handles PUT requests.
// app.delete	Handles DELETE requests.
// app.listen	Starts the server and listens for connections.
// app.render	Renders a view template.
// app.param	Adds callback triggers for route parameters.
// app.route	Creates chainable route handlers for a specific path.


// express.json(): Parses incoming requests with JSON payloads.
// express.urlencoded(): Parses incoming requests with URL-encoded payloads.
// express.static(): Serves static files.

// Key Differences Between express.json() and express.urlencoded()
// Feature	        express.json()	        express.urlencoded()
// Purpose	        Parses JSON payloads.	Parses URL-encoded payloads (e.g., forms).
// Content-Type	application/json	    application/x-www-form-urlencoded
// Data            Format	JSON string ({"name": "John"})	URL-encoded string (name=John&age=30)
// Output	        JavaScript object (req.body)	JavaScript object (req.body)
// Nested Data Support	Yes (JSON supports nested objects/arrays)	Yes (if extended: true)
// Library Used	Built-in JSON parser	qs (if extended: true) or querystring
