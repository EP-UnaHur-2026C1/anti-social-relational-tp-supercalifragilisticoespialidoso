const userModel = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      nickName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'Users', timestamps: true },
  )

  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' })
    User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' })
    User.belongsToMany(User, {
      through: 'UserFollower',
      as: 'followers',
      foreignKey: 'followedId',
      otherKey: 'followerId',
    })
    User.belongsToMany(User, {
      through: 'UserFollower',
      as: 'following',
      foreignKey: 'followerId',
      otherKey: 'followedId',
    })
  }

  return User
}

export default userModel
