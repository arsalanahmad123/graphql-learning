import { users } from '../dummyData/data.js';

const userResolver = {
    Query: {
        users: () => {
            return users;
        },
        user: (_, args) => {
            return users.find(user => user._id === args.userID);
        },
    },
    Mutation: {
    }
}

export default userResolver;