module.exports = ( sequelize, Datatypes ) => {
  // el define recibe 3 cosas:
  //1 el alias
  //2 las columnas
  //3 la configuracion( nombre de kla tablam, si qujeremos timestamps, etc)
  const alias = "Usuario"; // asi lo llamaremos en los controladores
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
    email: {
      type: Datatypes.STRING(255),
      allowNull: false,
      unique: true, 
    },
    password: {
      type: Datatypes.STRING(255),
      allowNull: false
    },
    // ⬇️⬇️⬇️ NUEVO CAMPO ROL ⬇️⬇️⬇️
    rol: {
        type: Datatypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false,
        comment: 'Rol del usuario: user (usuario normal) o admin (administrador)'
    },
    imagen: {
      type: Datatypes.STRING(255),
      allowNull: true,
      comment: "Nombre del archivo de imagen de perfil del usuario"
    }
  };
  const config = {
    tableName: "usuarios",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  };

  // ahora definimos y creamos la tabla
  const Usuario = sequelize.define(alias, cols, config);

  // cuando tengasmos relaciones entre tablas, las agregamos aca
  Usuario.associate = (models) => {
    // un usuario tiene muchos productos
    Usuario.hasMany(models.Producto,{
      foreignKey: 'usuario_id',
      as: 'productos'
    })
  }
  // luego de las relaciones, devolvemos Usuario
  return Usuario;

}