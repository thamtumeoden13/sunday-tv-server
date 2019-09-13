const resolvers = {
    Query: {
        // info: () => `This is the API of a Hackernews Clone`, 
        publishedPosts: (root, args, context) => {
            return context.prisma.posts({ where: { published: true } })
        },
        post: (root, args, context) => {
            return context.prisma.post({ id: args.postId })
        },
        postsByUser: (root, args, context) => {
            return context.prisma
                .user({
                    id: args.userId,
                })
                .posts()
        },
        users: (root, args, context) => {
            // if (!context) {
            //     throw new Error('Not Authenticated', root, args, context)
            // } 
            return context.prisma.users()
        },
    },
    Mutation: {
        createDraft: (root, args, context) => {
            return context.prisma.createPost({
                title: args.title,
                author: {
                    connect: { id: args.userId },
                },
            })
        },
        publish: (root, args, context) => {
            return context.prisma.updatePost({
                where: { id: args.postId },
                data: { published: true },
            })
        },
        createUser: (root, args, context) => {
            return context.prisma.createUser({ name: args.name })
        },
    },
    User: {
        posts: (root, args, context) => {
            return context.prisma
                .user({
                    id: root.id,
                })
                .posts()
        },
    },
    Post: {
        author(root, args, context) {
            return context.prisma
                .post({
                    id: root.id,
                })
                .author()
        },
    },
}

module.exports = resolvers