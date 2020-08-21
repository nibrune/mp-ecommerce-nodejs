var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

// Agrega credenciales
mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
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

app.get('/success', function (req, res) {
    res.render('success', req.query);
});

app.get('/failure', function (req, res) {
    res.render('failure', req.query);
});

app.get('/pending', function (req, res) {
    res.render('pending', req.query);
});

app.post('/notification', function (req, res) {
    console.log(req.body);
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

const PORT = process.env.PORT || 3000;
app.listen(PORT); 


app.post('/pagar', function (req, res) {

   // Crea un objeto de preferencia
   let preference = {
    items: [
        {
            id: "1234",
            title: req.body.title,
            picture_url: req.body.img.replace('./', req.get('origin') + '/'),
            description: "​Dispositivo móvil de Tienda e-commerce",
            quantity: Number.parseInt(req.body.unit),
            unit_price: Number.parseInt(req.body.price)
        }
    ],
    payer: {
        name: "Lalo",
        surname: "Landa",
        email: "test_user_63274575@testuser.com",
        phone: {
            area_code: "11",
            number: 22223333
        },
        identification: {
            type: "DNI",
            number: "32659430"
        },
        address: {
            street_name: "False",
            street_number: 123,
            zip_code: "1111"
        }
    },
    back_urls: {
        success: req.get('origin') + "/success",
        failure: req.get('origin') + "/failure",
        pending: req.get('origin') + "/pending"
    },
    auto_return: "approved",
    payment_methods: {
        excluded_payment_methods: [
            {
                id: "amex"
            }
        ],
        excluded_payment_types: [
            {
                id: "atm"
            }
        ],
        installments: 6
    },
    notification_url: req.get('origin') + "/notification",
    external_reference: "nibrune@gmail.com"
};

console.log(preference);
mercadopago.preferences.create(preference)
    .then(function (response) {
        res.redirect(response.body.init_point);
     }).catch(function (error) {
        console.log(error);
        res.redirect("/");
    });

});




