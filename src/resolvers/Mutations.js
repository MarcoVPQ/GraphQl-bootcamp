import  uuidv4 from "uuid"


const Mutations = {
    createUser(parent, args, { db }, info){
        const { email } = args.data
        const emailTaken = db.users.some(user => user.email === email )

        if(emailTaken){
            throw new Error('Email taken')
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }
        
        db.users.push(user)

        return user
    },
    deleteUser(parent, args, { db }, info){
        const userIndex = db.users.findIndex(user => user.id === args.id)

        if(userIndex === -1){
            throw new Error('No user found')
        }

        const deletedUser = db.users.splice(userIndex, 1)
        
        db.posts = db.posts.filter(post => {
            const match = post.author === args.id

            if(match){
                db.comments = db.comments.filter(comment => comment.post !== post.id)
            }
            return !match
        })

        db.comments = db.comments.filter(comment => comment.author !== args.id)


        return deletedUser[0]
    },

    updateUser(parent, { id, data }, { db }, info){
        const user = db.users.find(user => user.id === id)

        if(!user) throw new Error('User not found')

        if(typeof data.email === 'string'){
            const emailTaken = db.users.some(user => user.email === data.email)

            if(emailTaken) throw new Error('Email taken')

            user.email = data.email
        }

        if(typeof data.name === 'string'){
            user.name = data.name
        }

        if(typeof data.age !== undefined){
            user.age = data.age
        }

        return user

    },
    createPost(parent, args, { db, pubsub }, info){
        const { author } = args.data
        const userExists = db.users.some(user => user.id === author)

        if(!userExists){
            throw new Error('User not found')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)

        if(post.published){
            pubsub.publish('post', { 
                post: {
                    mutation: 'CREATED',
                    data: post
                }
             })
        }

        return post
    },
    updatePost(parent, { id, data }, { db, pubsub } , info){
 
        const post = db.posts.find(post => post.id === parseInt(id))

        const originalPost = { ...post}

        if(!post) throw new Error('No post found')

        if(typeof data.title === "string"){
            post.title = data.title
        }

        if(typeof data.body === "string"){
            post.body = data.body
        }

        if(typeof data.published === "boolean"){
            post.published = data.published

            if(originalPost.published && !post.published){
                pubsub.publish('post' , {
                    post: {
                        mutation: "DELETED",
                        data: originalPost
                    }
                })
            }else if (!originalPost.published && post.published){
                pubsub.publish('post' , {
                    post: {
                        mutation: "CREATED",
                        data: post
                    }
                })
            } 
        } else if (post.published){
            pubsub.publish('post' , {
                post: {
                    mutation: "UPDATED",
                    data: post
                }
            })
        }

        return post
    },
    deletePost(parent, args, { db, pubsub }, info){
        const { id } = args
        const postIndex = db.posts.findIndex(post => post.id === parseInt(id))

        if(postIndex === -1){
            throw new Error('Post not found')
        }

        const [ post ] = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter(comment => comment.post !== parseInt(id))

        if(post.published){
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, { db, pubsub } , info){

        const { author, post } = args.data
        const userExists = db.users.some(user => user.id === author)
        const postExistsAndIsPublished = db.posts.some(postItem => postItem.id === post && postItem.published)
        
        if(!userExists || !postExistsAndIsPublished){
            throw new Error("Unable to find user and post")
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)

        pubsub.publish(`comment ${post}`, {
            comment: { 
                mutation: "CREATED",
                data: comment
             }
        })

        return comment
    },
    updateComment(parent, { id, data }, { db, pubsub }, info){

        const comment = db.comments.find(comment => comment.id === id)
        
        if(!comment) throw new Error('No comment found')
        

        if(typeof data.text === 'string'){
            comment.text = data.text
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: { 
                mutation: "UPDATED",
                data: comment
             }
        })

        return comment
    },
    deleteComment(parent, args, { db, pubsub }, info){
        const { id } = args
        const commentIndex = db.comments.findIndex(comment => comment.id === id)

        if(commentIndex === -1){
            throw new Error('No comment found')
        }
        const [comment] = db.comments.splice(commentIndex, 1)

        pubsub.publish(`comment ${comment.post}`, {
            comment: { 
                mutation: "DELETED",
                data: comment
             }
        })

        return comment
    }
}

export default Mutations