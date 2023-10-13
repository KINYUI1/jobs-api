require('dotenv').config();
require('express-async-errors');
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const connectDB = require('./db/connect')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const ratelimiter = require('express-rate-limit')
const authenticationMiddleware = require('./middleware/authentication')
const express = require('express');
const app = express();

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocumentation = YAML.load('./swagger.yaml')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1)
app.use(ratelimiter({windowMs: 15*60*1000,
  max:100
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('<h1>Jobs api</h1><a href="/api-docs">Documentation</a>');
});

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocumentation))

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticationMiddleware,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    connectDB()
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
