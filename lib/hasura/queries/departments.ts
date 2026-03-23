import { gql } from 'graphql-request'

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments(
      where: { deleted_at: { _is_null: true } }
      order_by: { created_at: desc }
    ) {
      id
      name
      created_at
    }
  }
`

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($name: String!) {
    insert_departments_one(object: { name: $name }) {
      id
      name
      created_at
    }
  }
`

export const CREATE_DEPARTMENT_USER = gql`
  mutation CreateDepartmentUser(
    $email: String!
    $password: String!
    $department_id: uuid!
  ) {
    insert_users_one(object: {
      email: $email
      password: $password
      role: "department"
      department_id: $department_id
    }) {
      id
      email
      role
      department_id
    }
  }
`