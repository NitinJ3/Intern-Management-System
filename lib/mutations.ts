// lib/mutations.ts
import { gql } from 'graphql-request'

// ── Create Department ─────────────────────────────────────────────
export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($name: String!) {
    insert_departments_one(object: { name: $name }) {
      id
      name
    }
  }
`

// ── Create Department User ────────────────────────────────────────
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

// ── Create Intern (user + intern record together) ─────────────────
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
      email
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

// ── Fetch Departments (for dropdowns) ────────────────────────────
export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments(where: { deleted_at: { _is_null: true } }) {
      id
      name
    }
  }
`

// ── Fetch Institutes (for dropdowns) ─────────────────────────────
export const GET_INSTITUTES = gql`
  query GetInstitutes {
    institutes(where: { deleted_at: { _is_null: true } }) {
      id
      name
    }
  }
`

// ── Fetch Internship Statuses ─────────────────────────────────────
export const GET_STATUSES = gql`
  query GetStatuses {
    internship_status {
      id
      status
    }
  }
`