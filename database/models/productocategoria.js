module.exports = ( sequelize, Datatypes ) => {
  
  const alias = "ProductoCategoria"; // asi lo llamaremos en los controladores
  const cols ={
    id: {
      type: Datatypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull:false,
    },
    producto_id:{
      type: Datatypes.INTEGER,
      allowNull: false
    },
    categoria_id:{
      type: Datatypes.INTEGER,
      allowNull: false
    }
     
  };
  const config = {
    tableName: "producto_categorias",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  };

  // ahora definimos y creamos la tabla
  const ProductoCategoria  = sequelize.define(alias, cols, config);

  // cuando tengasmos relaciones entre tablas, las agregamos aca
  ProductoCategoria.associate = (models) => {
   // las relaciones ya estan manejadas en el belongstoMany
   // no necesitamnos definir mas asociaciones aca.
   // sequelize lo hace por nosotros. 
  }
  // luego de las relaciones, devolvemos Producto
  return ProductoCategoria;

}