var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

// Agrega credenciales
mercadopago.configure({
  access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398'
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

const PORT = process.env.PORT || 3000;
app.listen(PORT); 


app.post('/pagar', function (req, res) {

    //console.log(req.query)
    console.log(req.body)

    // Crea un objeto de preferencia
    let preference = {

        items: [
        {
            title: 'Mi producto',
            unit_price: 100,
            quantity: 1,
            id: "",
            picture_url: "",
            title: "Dummy Item",
            description: "Multicolor Item",
            category_id: "",
            quantity: 1,
            unit_price: 10
        }
        ]
    };
   
    mercadopago.preferences.create(preference)
    .then(function(response){
    // Este valor reemplazará el string "<%= global.id %>" en tu HTML
    global.id = response.body.id;

  //  console.log(response);
    res.redirect(response.body.init_point);
    }).catch(function(error){
    console.log(error);
    });

    
});




