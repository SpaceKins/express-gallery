'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {

        return queryInterface.bulkInsert('Photos', [{
            link: 'http://lorempixel.com/300/300/cats/1',
            author: 'Ellie Mohr',
            description: 'Suscipit rerum totam fuga repellendus distinctio unde impedit. Laborum vitae ipsum sint culpa fugiat. Rerum dolorum et quam cum dignissimos assumenda. Voluptatem nulla fuga aut beatae laborum. Libero voluptas in amet labore minus.',
            createdAt: '2016-05-11T01:28:07.304Z',
            updatedAt: '2016-05-11T01:28:07.304Z'
        }], {});
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Photos');
    }
};