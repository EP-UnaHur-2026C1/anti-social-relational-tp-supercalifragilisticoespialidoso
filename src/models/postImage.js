const postImageModel = (sequelize, DataTypes) => {
  const PostImage = sequelize.define(
    'PostImage',
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isUrl: true },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'PostImages', timestamps: false },
  )

  PostImage.associate = (models) => {
    PostImage.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' })
  }

  return PostImage
}

export default postImageModel
