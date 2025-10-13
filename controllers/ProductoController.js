const { log } = require('console');
const{ Producto, Usuario, Categoria, ProductoImagen } = require('../database/models');
const fs = require('fs');


const productoController = {

    index: async ( req, res ) => {
        try {
            const productos = await Producto.findAll({
                include:[
                    {
                        model:Usuario,
                        as: 'dueño'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: []}
                    }
                ]
            });

            console.log(`Encontrados ${productos.length} productos`);            
            // console.log(JSON.stringify(productos,null, 4));

            res.render('productos/index',{
                title: 'Lista de Productos',
                productos: productos,
                h1 : 'Productos'
            })
            
        } catch (error) {
            
        }
    },
    show: async( req, res ) => {
        try {
            const producto = await Producto.findByPk(req.params.id, {
                 include:[
                    {
                        model:Usuario,
                        as: 'dueño'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: []}
                    },
                    {
                        model: ProductoImagen,
                        as: 'imagenes'
                    }

                ]
            });

            if(!producto) {
                return res.status(404).render('errors/404',{
                    title: "Producto no encotrado",
                    h1: ' Error 404',
                    mensaje: "El producto solicitado no existe",
                    url: req.url
                })
            }
            console.log("producto en show.ejs con imagenes: ", JSON.stringify(producto, null, 4));
            
            
            res.render('productos/show', {
                title: `Producto: ${producto.nombre}`,
                producto: producto,
                h1 : producto.nombre
            })
        } catch (error) {
            console.log("error al obtener producto:", error);      
            res.redirect('/productos')      
        }
    }, 
    create: async ( req, res ) => {
        try {
            //obterner usuarios y categorias para los selects
            const usuarios = await Usuario.findAll();
            const categorias = await Categoria.findAll();

            res.render('productos/create', {
                title: 'Crear Producto',
                h1: 'Nuevo Producto',
                usuarios: usuarios,
                categorias:categorias,
                errors: [],
                oldData: {}        
            })
        } catch (error) {
            console.log("Error cargandoi el formulario:", error);
            res.redirect('/productos');
            
        }
    },
    store: async (req,res) => {
        try {
            const { nombre, precio, descripcion, usuario_id, categorias} = req.body;

            console.log("datos recibidos: ", {nombre, precio, descripcion, usuario_id, categorias});
            console.log('archivos recibidos: ', req.files?.length || 0);           
            
            // validacion: debe haber por lo menos una imagen
            if(!req.files || req.files.length == 0) {
                throw new Error('Debe subir al menos una imagen del producto')
            }

            console.log("imagenes recibidas: ", JSON.stringify(req.files, null, 4));
            
            const nuevoProducto = await Producto.create({
                nombre,
                precio,
                descripcion,
                usuario_id
            })

            console.log('Producto creado con ID: ', nuevoProducto.id);
            
            // CORRECCIÓN: ProductoImagen con mayúscula
            for(const file of req.files){
                console.log("Guardando Imagen: ", file.filename);

                await ProductoImagen.create({
                    producto_id: nuevoProducto.id,
                    imagen: file.filename
                })                
            }            

            // asociar categorias, si las hay
            if (categorias && categorias.length > 0){
                await nuevoProducto.setCategorias(categorias)
            }
            
            res.redirect(`/productos/${nuevoProducto.id}`)
        } catch (error) {
            console.log('Error al crear producto:', error); // Agregado para debugging
            const usuarios = await Usuario.findAll();
            const categorias =  await Categoria.findAll();

            return res.render('productos/create', {
                errors: errors.array(),
                oldData: req.body,
                title: 'Crear Producto',
                h1: 'Nuevo Producto',
                usuarios,
                categorias
            })
        }
    },
    edit: async (req, res ) => {
        try {
            const usuarios = await Usuario.findAll();
            const categorias = await Categoria.findAll();
            const producto = await Producto.findByPk(req.params.id, {
                 include:[
                    {
                        model:Usuario,
                        as: 'dueño'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: []}
                    }
                ]
            });

            if(!producto) {
                return res.status(404).render('errors/404',{
                    title: "producto no encontrado",
                    h1: 'error 404',
                    mensaje: 'El producto solicitado no existe',
                    url: req.url
                })
            }
            console.log("producto en edit.ejs: ", JSON.stringify(producto, null, 4));
            
            res.render('productos/edit', {
                title: `Producto: ${producto.nombre}`,
                producto: producto,
                h1 : producto.nombre,
                usuarios: usuarios,
                categorias: categorias
            })
        } catch (error) {
            console.log("error al cargar el form,ulario de edicion:", error);            
        }
    },
    update: async ( req, res ) => {
        try {
            // obtenemos los datos del usuario, para actualizar
            
            const { nombre, precio, descripcion, usuario_id, categorias} = req.body;       
            
            if(!nombre || nombre.trim().length < 4 ){
                throw new Error("el nombre debe tener 2 caracteres")
            }
            // obtenemos el producto a actualizar
            const producto = await Producto.findByPk(req.params.id, {
                 include:[
                    {
                        model:Usuario,
                        as: 'dueño'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: []}
                    }
                ]
            })
              if(!producto) {
                 return res.status(404).render('errors/404',{
                     title: "producto no encontrado",
                     h1: 'error 404',
                     mensaje: 'El producto solicitado no existe',
                     url: req.url
                 })
            }

            // actualizamos el producto con los nuevos del usuario

            await producto.update({
                nombre: nombre.trim(),
                precio: parseFloat(precio),
                descripcion: descripcion.trim(),
                usuario_id
            })

            // actualizar categorias
            if(categorias && categorias.length > 0) {
                await producto.setCategorias(categorias);
            } else {
                // si no se selecciono ninguna categoria, elimino todas
                await producto.setCategorias([]);
            }

            // una vez que se actualizo todo, redirijo al detalle de producto

            res.redirect(`/productos/${producto.id}`);
        } catch (error) {
            console.log('error al actualizar producto: ',error);
            // en caso de error, recargar el formulario
            const producto = await Producto.findByPk(req.params.id);
            const usuarios = await Usuario.findAll();
            const categoriasAll = await Categoria.findAll();
            res.render('productos/edit',{
                producto,
                usuarios,
                categorias: categoriasAll,
                h1: "Editar Producto",
                title: `Producto: ${producto.nombre}`,
                old: req.body
            })
        }
    },
    destroy: async (req, res) => {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if(!producto) {
                 return res.status(404).render('errors/404',{
                     title: "producto no encontrado",
                     h1: 'error 404',
                     mensaje: 'El producto solicitado no existe',
                     url: req.url
                 })
            }

            await producto.destroy();
            res.redirect('/productos')
        } catch (error) {
            console.log('error al eliminar producto: ',error);            
        }
    }
}

module.exports = productoController;