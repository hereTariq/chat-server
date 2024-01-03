const ppl = [
    {
        id: 2,
        name: 'j',
    },
    {
        id: 1,
        name: 'a',
    },
    {
        id: 4,
        name: 't',
    },
    {
        id: 3,
        name: 'j',
    },
];

let id = 3;
const { matchingUsers, notMatchingUsers } = ppl.reduce(
    (acc, user) => {
        if (user.id === id) {
            acc.matchingUsers.push(user);
        } else {
            acc.notMatchingUsers.push(user);
        }
        return acc;
    },
    { matchingUsers: [], notMatchingUsers: [] }
);

console.log('Matching Users:', matchingUsers);
console.log('Not Matching Users:', notMatchingUsers);
