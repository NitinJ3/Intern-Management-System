// lib/hasura.ts
import { GraphQLClient } from 'graphql-request'

// Server-side only — bypasses all permissions (full DB access)
export const adminClient = new GraphQLClient(
  process.env.HASURA_ENDPOINT!,
  {
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
    },
  }
)

// Client-side — respects row level permissions via JWT
export function userClient(token: string) {
  return new GraphQLClient(process.env.HASURA_ENDPOINT!, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}