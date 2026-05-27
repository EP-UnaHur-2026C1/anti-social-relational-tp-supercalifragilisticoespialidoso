export const commentModel = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'Comments', timestamps: true },
  )

  Comment.associate = (models) => {
    Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' })
    Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
  }

  return Comment
}
