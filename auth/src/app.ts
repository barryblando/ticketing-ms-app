import express from 'express'
// express-async-errors to handle asynchronous errors
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@retr0tickets/common'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

const app = express()

// for cookie session secure property
// the reason for this is the traffic is being proxy to app
// through ingress-nginx
app.set('trust proxy', true)

app.use(json())
app.use(
  cookieSession({
    signed: false,
    // secure HTTPS, Note: in postman disable SSL cert verification
    // if dev or prod set to true, otherwise if test set to false
    // Jest automatically defines env variable NODE_ENV as test
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

// Error Handler
app.use(errorHandler)

export { app }