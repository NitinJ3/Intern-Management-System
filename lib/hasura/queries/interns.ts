import { gql } from 'graphql-request'

export const GET_ALL_INTERNS = gql`
  query GetAllInterns {
    interns(
      where: { deleted_at: { _is_null: true } }
      order_by: { created_at: desc }
    ) {
      id
      name
      gender
      phone
      start_date
      end_date
      user { email }
      department { name }
      institute { name }
      internship_status { status }
    }
  }
`

export const CREATE_INTERN_USER = gql`
  mutation CreateInternUser(
    $email: String!
    $password: String!
    $department_id: uuid!
  ) {
    insert_users_one(object: {
      email: $email
      password: $password
      role: "intern"
      department_id: $department_id
    }) {
      id
    }
  }
`

export const CREATE_INTERN = gql`
  mutation CreateIntern(
    $user_id: uuid!
    $department_id: uuid!
    $name: String!
    $gender: String
    $phone: String
    $institute_id: uuid
    $start_date: date
    $end_date: date
    $status_id: uuid
  ) {
    insert_interns_one(object: {
      user_id: $user_id
      department_id: $department_id
      name: $name
      gender: $gender
      phone: $phone
      institute_id: $institute_id
      start_date: $start_date
      end_date: $end_date
      status_id: $status_id
    }) {
      id
      name
    }
  }
`