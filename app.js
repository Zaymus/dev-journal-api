const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { env } = require('./util/constants');

const app = express();
const apiRouter = express.Router();

const serverRouter = require('./routes/server');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const taskRouter = require('./routes/tasks');

apiRouter.use('/tasks', taskRouter);
apiRouter.use('/server', serverRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/posts', postRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// app.use(middleware);
app.use('/api', apiRouter);

app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

mongoose
	.connect(env.MONGODB_URL)
	.then((result) => {
		app.listen(env.API_PORT);
		console.log(`Listening on port ${env.API_PORT}!`);
	})
	.catch((err) => {
		console.log(err);
	});
