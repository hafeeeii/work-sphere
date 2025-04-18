import { z } from 'zod'
const required = () => z.string().min(1)
const optional = () => z.string().nullable()
export const FIELD_METADATA = {
  firstName: {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'John',
  },
  lastName: {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Doe',
  },
  dateOfBirth: {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    placeholder: '1990-01-01',
  },
  gender: {
    name: 'gender',
    label: 'Gender',
    placeholder: 'Select Gender',
  },
  email: {
    name: 'email',
    label: 'Email',
    placeholder: 'john@example.com',
  },
  employeeId: {
    name: 'employeeId',
    label: 'Employee ID',
    placeholder: 'EMP1',
  },
  manager: {
    name: 'manager',
    label: 'Manager',
    placeholder: 'Select Manager',
  },
  designation: {
    name: 'designation',
    label: 'Designation',
    placeholder: 'Select Designation',
    schema: required()
  },
  department: {
    name: 'department',
    label: 'Department',
    placeholder: 'Select Department',
    schema: required()

  },
  employeementType: {
    name: 'employeementType',
    label: 'Employment Type',
    placeholder: 'Permanent',
  },
  dateOfJoining: {
    name: 'dateOfJoining',
    label: 'Date of Joining',
    placeholder: '2022-01-01',
  },
  workLocationAutocomplete: {
    name: 'workLocation',
    label: 'Work Location',
    placeholder: 'Select Work Location',
  },
  phone: {
    name: 'phone',
    label: 'Phone',
    placeholder: '123455677',
  },
  departmentDescription: {
    name: 'departmentDescription',
    label: 'Description',
    placeholder: 'Description',
    schema: optional()
  },
  departmentCode: {
    name: 'departmentCode',
    label: 'Department Code',
    placeholder: 'Department Code',
    schema: optional()
  },
  workLocation: {
    name: 'workLocationName',
    label: 'Work Location Name',
    placeholder: 'Work Location Name',
    schema: required()
  },
  state: {
    name: 'state',
    label: 'State',
    placeholder: 'State',
    schema: required()
  },
  city: {
    name: 'city',
    label: 'City',
    placeholder: 'City',
    schema: required()
  },
  pincode: {
    name: 'pincode',
    label: 'Pincode',
    placeholder: 'Pincode',
    schema: required()
  },
  addressLine1: {
    name: 'addressLine1',
    label: 'Address Line 1',
    placeholder: 'Address Line 1',
    schema: required(),
  },
  addressLine2: {
    name: 'addressLine2',
    label: 'Address Line 2',
    placeholder: 'Address Line 2',
    schema: required(),
  },
} as const;
