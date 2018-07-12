export class UserStorage {
    static saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
    static removeUser() {
        localStorage.removeItem('user');
    }

    static getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export const cognitoAttributes = [
    {
        "Name": "address",
        "Value": ""
    },
    {
        "Name": "gender",
        "Value": ""
    },
    {
        "Name": "name",
        "Value": ""
    },
    {
        "Name": "nickname",
        "Value": ""
    },
];