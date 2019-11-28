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
            const deaneriesByDiocese = context.prisma.diocese({ id: args.dioceseId })
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
        posters: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated', root, args, context)
            }
            const posters = context.prisma.posters()
            return posters;
        },
        poster: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const poster = context.prisma.poster({ id: args.id, })
            return poster;
        },
        categories: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated', root, args, context)
            }
            const categories = context.prisma.categories()
            return categories;
        },
        category: (root, args, context) => {
            if (!context) {
                throw new Error('Not Authenticated')
            }
            const category = context.prisma.category({ id: args.id, })
            return category;
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
            const { input } = args
            const diocese = context.prisma.createDiocese({
                name: input.name,
                shortName: input.shortName,
                published: input.published,
            })
            return diocese
        },
        updateDiocese: (root, args, context) => {
            // if (!context.user) return null;
            const { input, id } = args
            const diocese = context.prisma.updateDiocese({
                data: {
                    name: input.name,
                    shortName: input.shortName,
                    published: input.published,
                },
                where: { id: id }
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
            const { input } = args
            const deanery = context.prisma.createDeanery({
                name: input.name,
                shortName: input.shortName,
                published: input.published,
                diocese: { connect: { id: input.dioceseId } }
            })
            return deanery
        },
        updateDeanery: (root, args, context) => {
            // if (!context.user) return null;
            const { input, id } = args
            const deanery = context.prisma.updateDeanery({
                data: {
                    name: input.name,
                    shortName: input.shortName,
                    published: input.published,
                    diocese: { connect: { id: input.dioceseId } }
                },
                where: { id: id }
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
            const { input } = args
            const parish = context.prisma.createParish({
                name: input.name,
                shortName: input.shortName,
                published: input.published,
                deanery: { connect: { id: input.deaneryId } },
                diocese: { connect: { id: input.dioceseId } }
            })
            return parish
        },
        updateParish: (root, args, context) => {
            // if (!context.user) return null;
            const { input, id } = args
            const parish = context.prisma.updateParish({
                data: {
                    name: input.name,
                    shortName: input.shortName,
                    published: input.published,
                    deanery: { connect: { id: input.deaneryId } },
                    diocese: { connect: { id: input.dioceseId } }
                },
                where: { id: id }
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
        createCategory: async (root, args, context) => {
            // if (!context.user) return null;
            const { input } = args
            let posters = []
            if (input.images && input.images.length > 0) {
                input.images.map((image, i) => {
                    const poster = {
                        name: input.name,
                        image: image.secure_url,
                        thumbnail: image.secure_url,
                        secure_url: image.secure_url,
                        public_id: image.public_id
                    }
                    posters.push(poster)
                })
            }
            const category = await context.prisma.createCategory({
                name: input.name,
                title: input.title,
                content: input.content,
                published: input.published,
                diocese: { connect: { id: input.dioceseId } },
                deanery: { connect: { id: input.deaneryId } },
                parish: { connect: { id: input.parishId } },
                posters: { create: posters }
            })
            return category
        },
        updateCategory: async (root, args, context) => {
            // if (!context.user) return null;
            const { input, id } = args
            let posters = []
            if (input.images && input.images.length > 0) {
                input.images.map((image, i) => {
                    const poster = {
                        name: input.name,
                        image: image.secure_url,
                        thumbnail: image.secure_url,
                        secure_url: image.secure_url,
                        public_id: image.public_id
                    }
                    posters.push(poster)
                })
            }
            const category = await context.prisma.updateCategory({
                data: {
                    name: input.name,
                    title: input.title,
                    content: input.content,
                    published: input.published,
                    diocese: { connect: { id: input.dioceseId } },
                    deanery: { connect: { id: input.deaneryId } },
                    parish: { connect: { id: input.parishId } },
                    posters: {
                        update: posters
                    }
                },
                where: { id: id }
            })
            return category
        },
        deleteCategories: (root, args, context) => {
            // if (!context.user) return null;

            const count = context.prisma.deleteManyCategories({
                id_in: args.ids
            })
            return count
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
    Category: {
        diocese: (root, args, context) => {
            return context.prisma
                .category({
                    id: root.id,
                })
                .diocese()
        },
        deanery: (root, args, context) => {
            return context.prisma
                .category({
                    id: root.id,
                })
                .deanery()
        },
        parish: (root, args, context) => {
            return context.prisma
                .category({
                    id: root.id,
                })
                .parish()
        },
        posters: (root, args, context) => {
            return context.prisma
                .category({
                    id: root.id,
                })
                .posters()
        },
    },
    Poster: {
        category: (root, args, context) => {
            return context.prisma
                .poster({
                    id: root.id,
                })
                .category()
        },
    },

}

module.exports = resolvers