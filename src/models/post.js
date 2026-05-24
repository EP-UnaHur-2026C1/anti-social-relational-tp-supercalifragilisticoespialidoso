const postModel = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'Posts', timestamps: true },
  )

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    Post.hasMany(models.PostImage, { foreignKey: 'postId', as: 'images' })
    Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' })
    Post.belongsToMany(models.Tag, { through: 'PostTag', as: 'tags', foreignKey: 'postId' })
  }

  return Post
}

export default postModel
