const { v4: uuidv4 } = require('uuid');
const { parseRequestBody } = require('../utils/parseRequestBody');

let users = {};

const getUsers = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' });
  res.end(JSON.stringify(Object.values(users)));
};

const createUser = async (req, res) => {
  const user = await parseRequestBody(req);
  const id = uuidv4();
  users[id] = { id, ...user, hobbies: [] };
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users[id]));
};

const deleteUser = (req, res, userId) => {
  if (users[userId]) {
    delete users[userId];
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('User Not Found');
  }
};

const updateHobbies = async (req, res, userId) => {
  if (users[userId]) {
    const { hobbies } = await parseRequestBody(req);
    users[userId].hobbies = [...new Set([...users[userId].hobbies, ...hobbies])];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users[userId].hobbies));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('User Not Found');
  }
};

const getHobbies = (req, res, userId) => {
  if (users[userId]) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=3600' });
    res.end(JSON.stringify(users[userId].hobbies));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('User Not Found');
  }
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateHobbies,
  getHobbies
};