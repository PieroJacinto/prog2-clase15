module.exports = ( sequelize, Datatypes ) => {
  
  const alias = "Categoria"; // asi lo llamaremos en los controladores
  const cols ={
    id: {
      type: Datatypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull:false,
    },
    nombre: {
      type: Datatypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: Datatypes.TEXT,
      allowNull: false,
    },  
  };
  const config = {
    tableName: "categorias",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  };

  // ahora definimos y creamos la tabla
  const Categoria  = sequelize.define(alias, cols, config);

  // cuando tengasmos relaciones entre tablas, las agregamos aca
  Categoria.associate = (models) => {
    //un producto PERTENECE a un usuario
    Categoria.belongsToMany(models.Producto, {
      through: 'producto_categorias',
      foreignKey:'categoria_id',
      otherKey: 'producto_id',
      as: "productos"
    })
  }
  // luego de las relaciones, devolvemos Producto
  return Categoria;

}