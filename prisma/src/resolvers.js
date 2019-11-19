const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const resolvers = {
    Query: {
        deaneries: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated', root, args, context)
            }
            const deaneries = context.prisma.deaneries()
            return deaneries;
        },
        deanery: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const deanery = context.prisma.deanery({ id: args.id, })
            return deanery;
        },
        dioceses: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const dioceses = context.prisma.dioceses()
            return dioceses;
        },
        diocese: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const diocese = context.prisma.diocese({ id: args.id, })
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
            return users;
        }

    },
    Mutation: {
        createDeanery: (root, args, context) => {
            // if (!context.user) return null;

            const deanery = context.prisma.createDeanery({
                name: args.name,
                shortName: args.shortName,
                published: args.published,
                diocese: { connect: { id: args.dioceseId } }
            })
            return deanery
        },
        updateDeanery: (root, args, context) => {
            // if (!context.user) return null;

            const deanery = context.prisma.updateDeanery({
                data: {
                    name: args.name, shortName: args.shortName, published: args.published,
                    diocese: { connect: { id: args.dioceseId } }
                },
                where: { id: args.id }
            })
            return deanery
        },
        deleteDeaneries: (root, args, context) => {
            // if (!context.user) return null;

            const count = context.prisma.deleteManyDeaneries({
                id_in: args.ids
            })
            return count
        },
        createDiocese: (root, args, context) => {
            // if (!context.user) return null;

            const diocese = context.prisma.createDiocese({
                name: args.name,
                shortName: args.shortName,
                published: args.published,
            })
            return diocese
        },
        updateDiocese: (root, args, context) => {
            // if (!context.user) return null;

            const diocese = context.prisma.updateDiocese({
                data: { name: args.name, shortName: args.shortName, published: args.published, },
                where: { id: args.id }
            })
            return diocese
        },
        deleteDioceses: (root, args, context) => {
            // if (!context.user) return null;

            const count = context.prisma.deleteManyDioceses({
                id_in: args.ids
            })
            return count
        },

        signUp: async (parent, { email, password }, ctx, info) => {
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await ctx.prisma.createUser({
                email,
                password: hashedPassword,
            })

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                'my-secret-from-env-file-in-prod',
                {
                    expiresIn: '1m', // token will expire in 30days
                },
            )
            return {
                token,
                user,
            }
        },
        signIn: async (parent, { email, password }, ctx, info) => {
            const user = await ctx.prisma.user({ email })
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