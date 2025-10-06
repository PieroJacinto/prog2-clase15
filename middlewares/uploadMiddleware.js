const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: ( req, file , cb ) => {
        //cb = callback gunction (funciond e respuesta)
        //cb(error, resultado)
        //cb(null, carpeta) // todo ok, null, no hay error, usa esta carpeta

        // TOMAMOS UNA DECISION: SEGUN EL CAMPO DEL FORMULARIO
        console.log('campo del archivo:', file.fieldname); //para debugging

        if(file.fieldname == 'imagen_usuario'){
            // usuarios, una imagen de perfil unica.
            cb( null,  path.join(__dirname, "../public/images/usuarios"))
        } else if(file.fieldname == 'imagenes_producto'){
            // productos: multiples imagenes
            cb( null,  path.join(__dirname, "../public/images/productos"))
        } else {
            cb( null,  path.join(__dirname, "../public/images"))
        }
    }, 
    filename: (req, file, cb) => {
            const timestamp = Date.now();
            const extension = path.extname(file.originalname);
            
            // NOMBRE según el tipo de archivo
            let prefijo = 'archivo';
            if (file.fieldname === 'imagen_usuario') {
                prefijo = 'usuario';
            } else if (file.fieldname === 'imagen_producto') {
                prefijo = 'producto';
            }
            
            const newFileName = `${prefijo}-${timestamp}${extension}`;
            cb(null, newFileName);
        }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5  // nuevo, maximo 5 archivos por request
    },
    fileFilter: ( req, file, cb ) => {
        // VALIDACION DE TIPOS DE ARCHIVO
        // file.mimetype = "image/jpeg", "image/png", "text/plain", etc
        if( file.mimetype.startsWith('image/')){
            cb(null, true) // aceptamos el archivo
        } else {
            cb(new Error('Solo se permiten imagenes'), false); // rechazar
        }
    }
})

module.exports = upload;