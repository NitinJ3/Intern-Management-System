import { GraphQLClient } from 'graphql-request'

if (!process.env.HASURA_ENDPOINT) {
  throw new Error('HASURA_ENDPOINT is not defined')
}

if (!process.env.HASURA_ADMIN_SECRET) {
  throw new Error('HASURA_ADMIN_SECRET is not defined')
}

// Server-side only — never import in client components
export const adminClient = new GraphQLClient(
  process.env.HASURA_ENDPOINT,
  {
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    },
  }
)

// Client-side — uses JWT, respects row-level permissions
export const userClient = (token: string) =>
  new GraphQLClient(process.env.NEXT_PUBLIC_HASURA_ENDPOINT!, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })