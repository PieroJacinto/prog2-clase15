const path = require("path");

const homeController = {
    index: ( req, res ) => {
         console.log("dashboard principal");
        //  const datosParaview = {
        //     title: "Inicio - Sistema MVC"
        //  }

         res.render('index', {
             title: "Inicio - Sistema MVC",   
             h1 : "Inicio - Programacion 2"          
         }) // cambio res.render en luigar de res.sendfile, y peudo enviar informacion
         
    },
    about: ( req, res ) => {
          res.render('about', {
             title: "About - clase 03",   
             h1 : "About"          
         }) 
         
    }, 
    contacto: ( req, res ) => {
       res.render('contacto', {
             title: "Contacto - clase 03",   
             h1 : "Contacto"          
         }) 
    },
    errors: (req, res ) =>{
        console.log(`404: ${req.url}`);
        res.render('errors/404', {
            title: "Error",
            h1: "Error"
        })
    }
}

module.exports = homeController;