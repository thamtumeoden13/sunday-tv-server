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
            const deaneries = context.prisma.deaneries()
            console.log({ deaneries })
            return deaneries;
        },
        deanery: (root, args, context) => {
            const deanery = context.prisma.deanery({ id: args.id, })
            console.log({ deanery })
            return deanery;
        },
        dioceses: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const dioceses = context.prisma.dioceses()
            console.log({ dioceses })
            return dioceses;
        },
        diocese: (root, args, context) => {
            const diocese = context.prisma.diocese({ id: args.dioceseId, })
            console.log({ diocese })
            return diocese;
        },
        currentUser: (parent, args, context) => {
            // this if statement is our authentication check
            if (!context) {
                throw new Error('Not Authenticated')
            }
            return context.prisma.users()
        },
        users: (parent, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const users = context.prisma.users()
            console.log({ users })
            return users;
        }

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
            console.log("args", args)
            const deanery = context.prisma.createDeanery({
                name: args.name,
                shortName: args.shortName,
                diocese: { connect: { id: args.dioceseId } }
            })
            return deanery
        },
        updateDeanery: (root, args, context) => {
            console.log("args", args)
            const deanery = context.prisma.updateDeanery({
                data: {
                    name: args.name, shortName: args.shortName,
                    diocese: { connect: { id: args.dioceseId } }
                },
                where: { id: args.id }
            })
            return deanery
        },
        createDiocese: (root, args, context) => {
            console.log("args", args)
            const diocese = context.prisma.createDiocese({ name: args.name, shortName: args.shortName })
            return diocese
        },
        updateDiocese: (root, args, context) => {
            console.log("args", args)
            const diocese = context.prisma.updateDiocese({
                data: { name: args.name, shortName: args.shortName },
                where: { id: args.id }
            })
            return diocese
        },

        signUp: async (parent, { email, password }, ctx, info) => {
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await ctx.prisma.createUser({
                email,
                password: hashedPassword,
            })
            console.log({ user })
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
        parishes: (root, args, context) => {
            return context.prisma
                .deanery({
                    id: root.id,
                })
                .parishes()
        },
    },

}

module.exports = resolvers