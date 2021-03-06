/*
Defines all the logic regarding routes and database operations in the Blogs context.
*/

const blogListRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogListRouter.get('/', async (req, res) => {
    const blogs = await Blog
        .find({})
        // select specific fields to be returned by the populate
        .populate('user', 'username name id')
    res.json(blogs.map(blog => blog.toJSON()))
})

blogListRouter.post('/', async (request, response) => {
    const newBlog = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!newBlog.url && !newBlog.title) {
        response.status(400).end()
    } else {
        const blog = new Blog({ ...request.body, user: user.id })
        const result = await blog.save()
        response.status(201).json(result)
    }

})

blogListRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const decToken = jwt.verify(request.token, process.env.SECRET)

    // Get the blog that should be deleted
    const blogToDelete = await Blog.findById(id)
    console.log(blogToDelete.user)

    // Check if there's a blog with the specified id
    if (blogToDelete) {
        // Check the if the creator of the blog is the one that wants to delete it
        if (blogToDelete.user === decToken.id) {
            await Blog.findByIdAndRemove(id)
            response.status(204).end()
        } else {
            response.status(401).json({ error: 'insufficient permissions' })
        }
    } else {
        response.status(400).json({ error: 'no blog found' })
    }
})

blogListRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user,
    }

    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, blog, { new: true })

    response.json(updatedBlog)
})

module.exports = blogListRouter
