module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define("Photo", {
        link: DataTypes.STRING,
        author: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // Photo.hasMany(models.Task)
            }
        }
    });

    return Photo;
};