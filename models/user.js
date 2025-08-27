'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email must be unique'
      },
      validate: {
        notEmpty: { msg: 'Email is required' },
        isEmail: { msg: 'Email format is invalid' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        len: {
          args: [5, 225],
          msg: 'Password must be at least 5 characters'
        }
      }
    }
  }, {
    sequelize,           
    modelName: 'User',   
    hooks: {
      beforeCreate(user) {
        const salt = bcrypt.genSaltSync(10)
        user.password = bcrypt.hashSync(user.password, salt)
      }
    }
  })
  return User
}
