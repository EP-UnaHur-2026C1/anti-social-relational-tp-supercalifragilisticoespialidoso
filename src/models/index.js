import { Sequelize } from 'sequelize'
import { createRequire } from 'node:module'
import { userModel } from './user.js'
import { postModel } from './post.js'
import { postImageModel } from './postImage.js'
import { commentModel } from './comment.js'
import { tagModel } from './tag.js'

const require = createRequire(import.meta.url)
const config = require('../config/config.json')

const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]

const sequelize = dbConfig.use_env_variable
  ? new Sequelize(process.env[dbConfig.use_env_variable], dbConfig)
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)

const User = userModel(sequelize, Sequelize.DataTypes)
const Post = postModel(sequelize, Sequelize.DataTypes)
const PostImage = postImageModel(sequelize, Sequelize.DataTypes)
const Comment = commentModel(sequelize, Sequelize.DataTypes)
const Tag = tagModel(sequelize, Sequelize.DataTypes)

const db = { User, Post, PostImage, Comment, Tag, sequelize, Sequelize }

;[User, Post, PostImage, Comment, Tag].forEach((model) => {
  if (model.associate) model.associate(db)
})

export { User, Post, PostImage, Comment, Tag, sequelize }
