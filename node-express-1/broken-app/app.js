const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json()); 

app.post('/', async (req, res, next) => {
  try {
    const developers = req.body.developers;

    const results = await Promise.all(
      developers.map(async d => {
        const response = await axios.get(`https://api.github.com/users/${d}`);
        return { name: response.data.name, bio: response.data.bio };
      })
    );

    return res.json(results);
  } catch (err) {
    next(err);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
