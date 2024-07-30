const http = require('http');
const url = require('url');
const userRoutes = require('./routes/userRoutes');

const PORT = 8000;

const requestHandler = async (req, res) => {
  try {
    const { pathname } = url.parse(req.url, true);
    const method = req.method;

    if (pathname.startsWith('/api/users')) {
      if (method === 'GET' && pathname === '/api/users') {
        await userRoutes.getUsers(req, res);
      } else if (method === 'POST' && pathname === '/api/users') {
        await userRoutes.createUser(req, res);
      } else if (method === 'DELETE' && pathname.startsWith('/api/users/')) {
        const userId = pathname.split('/')[3];
        await userRoutes.deleteUser(req, res, userId);
      } else if (method === 'PATCH' && pathname.startsWith('/api/users/')) {
        const userId = pathname.split('/')[3];
        await userRoutes.updateHobbies(req, res, userId);
      } else if (method === 'GET' && pathname.startsWith('/api/users/')) {
        const userId = pathname.split('/')[3];
        await userRoutes.getHobbies(req, res, userId);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});