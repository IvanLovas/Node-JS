const { v4: uuidv4 } = require('uuid');

let users = [];

const getUsers = () => users;

const getUserById = (id) => users.find(user => user.id === id);

const addUser = (name, email) => {
  const newUser = { id: uuidv4(), name, email, hobbies: [] };
  users.push(newUser);
  return newUser;
};

const deleteUser = (id) => {
  users = users.filter(user => user.id !== id);
};

const updateUserHobbies = (id, hobbies) => {
  const user = getUserById(id);
  if (user) {
    user.hobbies = Array.from(new Set([...user.hobbies, ...hobbies]));
  }
  return user;
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  deleteUser,
  updateUserHobbies
};