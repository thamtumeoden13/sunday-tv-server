const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const resolvers = {
    Query: {
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
        deaneriesByDiocese: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const deaneriesByDiocese = context.prisma.diocese({ id: args.dioceseId, })
            return deaneriesByDiocese;
        },
        parishes: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated', root, args, context)
            }
            const parishes = context.prisma.parishes()
            return parishes;
        },
        parish: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const parish = context.prisma.parish({ id: args.id, })
            return parish;
        },
        parishesByDeanery: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const parishesByDeanery = context.prisma.deanery({ id: args.deaneryId, })
            return parishesByDeanery;
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
                data: {
                    name: args.name,
                    shortName: args.shortName,
                    published: args.published,
                },
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
                    name: args.name,
                    shortName: args.shortName,
                    published: args.published,
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
        createParish: (root, args, context) => {
            // if (!context.user) return null;

            const parish = context.prisma.createParish({
                name: args.name,
                shortName: args.shortName,
                published: args.published,
                deanery: { connect: { id: args.deaneryId } },
                diocese: { connect: { id: args.dioceseId } }
            })
            return parish
        },
        updateParish: (root, args, context) => {
            // if (!context.user) return null;

            const parish = context.prisma.updateParish({
                data: {
                    name: args.name,
                    shortName: args.shortName,
                    published: args.published,
                    deanery: { connect: { id: args.deaneryId } },
                    diocese: { connect: { id: args.dioceseId } }
                },
                where: { id: args.id }
            })
            return parish
        },
        deleteParishes: (root, args, context) => {
            // if (!context.user) return null;

            const count = context.prisma.deleteManyParishes({
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
        parishes: (root, args, context) => {
            return context.prisma
                .diocese({
                    id: root.id,
                })
                .parishes()
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
    Parish: {
        deanery: (root, args, context) => {
            return context.prisma
                .parish({
                    id: root.id,
                })
                .deanery()
        },
        diocese: (root, args, context) => {
            return context.prisma
                .parish({
                    id: root.id,
                })
                .diocese()
        },
    },

}

module.exports = resolvers