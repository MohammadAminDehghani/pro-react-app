const User = require('app/models/user');

// Define your resolvers for the User type
// const userResolvers = {
//     Query: {
//         users: async function() {
//           return User.find({});
//         },
//       },
//       User: {
//         id: (parent) => parent.id,
//         name: (parent) => parent.name,
//         createdAt: (parent) => parent.createdAt,
//       },
//   };
  
//   // Export the User resolvers
//   module.exports = userResolvers;
module.exports = {
    Query: {
      users: async function () {
        const users = await User.find({});
        return users;
      },
    },
  };