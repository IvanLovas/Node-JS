const { v4: uuidv4 } = require('uuid');
const users = [];

const createUser = (req, res) => {
  parseRequestBody(req)
    .then(body => {
      const user = { id: uuidv4(), ...body, hobbies: [] };
      users.push(user);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ...user,
        links: {
          self: `/api/users/${user.id}`,
          hobbies: `/api/users/${user.id}/hobbies`,
          delete: `/api/users/${user.id}`
        }
      }));
    })
    .catch(err => {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid request');
    });
};

const getUsers = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' });
  const userList = users.map(user => ({
    ...user,
    links: {
      self: `/api/users/${user.id}`,
      hobbies: `/api/users/${user.id}/hobbies`,
      delete: `/api/users/${user.id}`
    }
  }));
  res.end(JSON.stringify(userList));
};

const deleteUser = (req, res) => {
  const userId = req.url.split('/')[3];
  const index = users.findIndex(user => user.id === userId);

  if (index !== -1) {
    users.splice(index, 1);
    res.writeHead(204);
    res.end(JSON.stringify({
      message: 'User not found',
      links: {
        allUsers: '/api/users'
      }
    }));
  }
  
  users.splice(userId, 1);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'User deleted successfully',
    links: {
      allUsers: '/api/users'
    }
  }));
};

const getHobbies = (req, res) => {
  const userId = req.url.split('/')[3];
  const user = users.find(user => user.id === userId);

  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=3600' });
    res.end(JSON.stringify({
      hobbies: user.hobbies,
      links: {
        user: `/api/users/${userId}`,
        addHobbies: `/api/users/${userId}/hobbies`
      }
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('User not found');
    return;
  }
};

const updateHobbies = (req, res) => {
  const userId = req.url.split('/')[3];
  parseRequestBody(req)
    .then(body => {
      const user = users.find(user => user.id === userId);

      if (user) {
        const existingHobbies = new Set(user.hobbies);
        body.hobbies.forEach(hobby => existingHobbies.add(hobby));
        user.hobbies = Array.from(existingHobbies);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user.hobbies));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
      }
    })
    .catch(err => {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid request');
    });
};

module.exports = {
  createUser,
  getUsers,
  deleteUser,
  getHobbies,
  updateHobbies
};