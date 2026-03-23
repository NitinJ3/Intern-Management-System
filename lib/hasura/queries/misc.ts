import { gql } from 'graphql-request'

export const GET_INSTITUTES = gql`
  query GetInstitutes {
    institutes(
      where: { deleted_at: { _is_null: true } }
      order_by: { name: asc }
    ) {
      id
      name
      location
    }
  }
`

export const GET_STATUSES = gql`
  query GetStatuses {
    internship_status(order_by: { status: asc }) {
      id
      status
    }
  }
`

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    users(
      where: {
        email: { _eq: $email }
        deleted_at: { _is_null: true }
      }
      limit: 1
    ) {
      id
      email
      password
      role
      department_id
    }
  }
`