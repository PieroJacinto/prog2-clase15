const express = require('express');
const app = express();
const path = require('path'); // para manejar rutas de archivos
require('dotenv').config();

const session = require("express-session"); // agregamos session

const methodOverride = require("method-override");
//requerimos los modelos de la db
const db = require('./database/models')

const PORT = process.env.PORT || 3000;

// CONFIGURACION EJS - SOLO ESTAS LINEAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// configurar la sesion

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24  // 1 dia en milisegundos
    }
}));


// middlewarae para hacer session disponible en todas vistas
const sessionLocals = require("./middlewares/sessionLocals");
app.use(sessionLocals);
// MIDDLEWARES PARA PARSEAR DATOS DE LOS FORMS

app.use(express.urlencoded({extended:true}))
app.use(express.json()); 
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
console.log('Middleware estatico configurado');

// probamos la db al iniciar el servidor
async function conectarDB(){
    try {
        await db.sequelize.authenticate();
        console.log("Conexion a MySQL exitosa");        
    } catch (error) {
        console.log('Error conectando a la DB:', error.message);       
    }
};

// ejecutamos trest de conexion
conectarDB();

// importamos las routes
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require('./routes/authRoutes'); // agregamos
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productosRoutes')

app.use('/', homeRoutes)
app.use('/auth', authRoutes) // agregamos
app.use('/usuarios', userRoutes)

app.use('/productos', productRoutes)

// MIDDLEWARE PARA MANEJAR 404 - DEBE IR AL FINAL DE TODAS LAS RUTAS
app.use((req, res, next) => {
    console.log(`404: ${req.url}`);
    res.status(404).render('errors/404', {
        title: "Página no encontrada",
        h1: "Error 404",
        url: req.url
    });
});

app.listen(PORT, () => {
    console.log('\n🚀 ===========================');
    console.log('      SERVIDOR INICIADO');
    console.log('==============================');
    console.log(`URL: http://localhost:${PORT}`);
    console.log('==============================\n'); 
})