import { Router } from 'express'

import { catchAsync } from './../../utils/catchAsync'

import * as postController from '../../controller/Post/index'

import { authorize } from '@/middlewares/authorize'

export const postsRouter = Router()

postsRouter.get('/', authorize, catchAsync(postController.getPosts))

postsRouter.post('/', authorize, catchAsync(postController.createPost))

// postsRouter.patch('/update', authorize, catchAsync(userController.updateUser))

// postsRouter.post('/register', catchAsync(userController.register))

// postsRouter.post('/login', catchAsync(userController.login))

// postsRouter.get('/confirm/:hash', catchAsync(userController.confirmEmail))
