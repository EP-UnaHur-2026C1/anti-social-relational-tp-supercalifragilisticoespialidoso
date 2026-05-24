export const tagModel = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { tableName: 'Tags', timestamps: false },
  )

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Post, { through: 'PostTag', as: 'posts', foreignKey: 'tagId' })
  }

  return Tag
}
