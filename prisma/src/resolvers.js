const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const resolvers = {
    Query: {
        // info: () => `This is the API of a Hackernews Clone`, 
        // publishedPosts: (root, args, context) => {
        //     return context.prisma.posts({ where: { published: true } })
        // },
        // post: (root, args, context) => {
        //     return context.prisma.post({ id: args.postId })
        // },
        // postersByUser: (root, args, context) => {
        //     if (!context) {
        //         throw new Error('Not Authenticated', root, args, context)
        //     }
        //     return context.prisma.user({ id: args.userId, }).posters()
        // },
        // users: (root, args, context) => {
        //     if (!context) {
        //         throw new Error('Not Authenticated', root, args, context)
        //     }
        //     return context.prisma.users()
        // },
        // user: (root, args, context) => {
        //     return context.prisma.user({ id: args.userId, })
        // },
        // posters: (root, args, context) => {
        //     if (!context) {
        //         throw new Error('Not Authenticated', root, args, context)
        //     }
        //     return context.prisma.posters()
        // },
        // poster: (root, args, context) => {
        //     return context.prisma.poster({ id: args.posterId, })
        // },
        deaneries: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated', root, args, context)
            }
            return context.prisma.deaneries()
        },
        deanery: (root, args, context) => {
            return context.prisma.deanery({ id: args.deaneryId, })
        },
        dioceses: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated', root, args, context)
            }
            return context.prisma.dioceses()
        },
        diocese: (root, args, context) => {
            return context.prisma.diocese({ id: args.dioceseId, })
        },
        deaneriesOfDiocese: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated', root, args, context)
            }
            return context.prisma.diocese({ id: args.dioceseId, })
        },
        currentUser: (parent, args, { user, prisma }) => {
            // this if statement is our authentication check
            if (!user) {
                throw new Error('Not Authenticated')
            }
            return prisma.user({ id: user.id })
        },

    },
    Mutation: {
        // createUser: (root, args, context) => {
        //     return context.prisma.createUser({ name: args.name, email: args.email })
        // },
        // createPoster: (root, args, context) => {
        //     return context.prisma.createPoster({
        //         name: args.name,
        //         authorCreated: {
        //             connect: { id: args.userId },
        //         },
        //         title: args.title
        //     })
        // },
        // publish: (root, args, context) => {
        //     return context.prisma.updatePost({
        //         where: { id: args.postId },
        //         data: { published: true },
        //     })
        // },
        createDeanery: (root, args, context) => {
            return context.prisma.createDeanery({
                name: args.name,
                shortName: args.shortName,
                diocese: {
                    connect: { id: args.dioceseId },
                },
            })
        },
        createDiocese: (root, args, context) => {
            return context.prisma.createDiocese({ name: args.name, shortName: args.shortName })
        },
        signUp: async (parent, { email, password }, ctx, info) => {
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await ctx.prisma.createUser({
                email,
                password: hashedPassword,
            })
            return user
        },
        signIn: async (parent, { email, password }, ctx, info) => {
            const user = await ctx.prisma.user({ email })
            console.log("user", { user, email, password })
            if (!user) {
                throw new Error('Invalid Login')
            }

            const passwordMatch = await bcrypt.compare(password, user.password)

            if (!passwordMatch) {
                throw new Error('Invalid Login')
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                'my-secret-from-env-file-in-prod',
                {
                    expiresIn: '30d', // token will expire in 30days
                },
            )
            return {
                token,
                user,
            }
        },
        signOut: async (parent, { email }, ctx, info) => {
            // const user = await ctx.prisma.user({ email })

            // if (!user) {
            //     throw new Error('Invalid Login')
            // }

            // const passwordMatch = await bcrypt.compare(password, user.password)

            // if (!passwordMatch) {
            //     throw new Error('Invalid Login')
            // }

            // const token = jwt.sign(
            //     {
            //         id: user.id,
            //         email: user.email,
            //     },
            //     'my-secret-from-env-file-in-prod',
            //     {
            //         expiresIn: '30d', // token will expire in 30days
            //     },
            // )
            // return {
            //     token,
            //     user,
            // }
        }
    },
    Diocese: {
        deaneries: (root, args, context) => {
            return context.prisma
                .diocese({
                    id: root.id,
                })
                .deaneries()
        },
    },
    Deanery: {
        diocese: (root, args, context) => {
            return context.prisma
                .deanery({
                    id: root.id,
                })
                .diocese()
        },
    },

}

module.exports = resolvers