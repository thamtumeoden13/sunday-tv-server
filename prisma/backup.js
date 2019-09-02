
type Image {
    id: ID! @id
createdAt: DateTime! @createdAt
updateAt: DateTime @updateAt
name: String
picture: String
thumbnail: String
description: String
album: Album
  }

type Album {
    id: ID! @id
name: String!
createdAt: DateTime! @createdAt
updateAt: DateTime @updateAt
parish: Parish!@relation(link: INLINE)
image: [Image!]!
  }

type Diocese {
    id: ID! @id
createdAt: DateTime! @createdAt
updateAt: DateTime @updateAt
name: String!
shortName: String!
deanery: [Deanery!]!
  }

type Deanery {
    id: ID! @id
createdAt: DateTime! @createdAt
updateAt: DateTime @updateAt
name: String!
shortName: String!
parish: [Parish!]!
diocese: Diocese
  }

type Parish {
    id: ID! @id
createdAt: DateTime! @createdAt
updateAt: DateTime @updateAt
name: String!
deanery: Deanery
Album: Album!
  }