import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express, { json, static as express_static, urlencoded } from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'
import sassMiddleware from 'node-sass-middleware'

import path from 'path'
import process from 'process'

import { usersRouter } from './routes/User/index'

import * as errorHandler from '@/middlewares/ErrorHandler'
import home from '@/routes/Home'
import { initSwagger } from '@/swagger'

const whitelist = ['localhost:8080', '192.168.0.103:8080']
const options: cors.CorsOptions = {
  origin: whitelist,
}

export const app = express()
config() //  .env activation
//  DB connect
if (process.env.DBURL) {
  mongoose.connect(process.env.DBURL, {}, (err) => {
    if (err) console.log(err)
    else console.log('connected')
  })
} else console.log('Add DBURL to .env !')
// view engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'hbs')
// other
app.use(cookieParser())
app.use(
  sassMiddleware({
    src: path.join(__dirname, '../public'),
    dest: path.join(__dirname, '../public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  }),
)
app.use(express_static(path.join(__dirname, '../public')))
app.use(cors(options))
app.use(helmet())
app.use(morgan('dev')) //  logging
//  expects request data to be sent in JSON format, which often resembles a simple JS object
app.use(json())
//  expects request data to be sent encoded in the URL, usually in strings or arrays
app.use(urlencoded({ extended: true }))
// API Routes
app.use('/', home)
app.use('/users', usersRouter)
initSwagger(app)
// Error Middleware
app.use(errorHandler.genericErrorHandler)
app.use(errorHandler.notFoundError)
