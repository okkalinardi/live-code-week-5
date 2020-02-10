'use strict';
module.exports = (sequelize, DataTypes) => {
  const { Model } = sequelize.Sequelize
  const bcrypt = require('../helpers/bcrypt')

  class User extends Model{}

  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isUnique: function(value, next) {
            User.findOne({
                where: {email: value}
            })
                .done(function(error, user) {
                    if (error)
                        return next(error);

                    if (user)
                        return next('Email address already in use!');
                    next();

                });
        }
    }
    },
    password: {
      type: DataTypes.STRING,
    }
  },{
    hooks: {
      beforeCreate(instance, options) {
        // console.log(instance)
        return bcrypt.hash(instance.dataValues.password)
        .then(hashedPassword => {
          instance.dataValues.password = hashedPassword
        })
        .catch(err => {
          next(err)
        })
      }
    },
    sequelize
  })

  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};