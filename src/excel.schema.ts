/* eslint-disable prettier/prettier */
export const studentSchema = {
  'Name': {
    prop: 'name',
    type: String,
  },
  'Email': {
    prop: 'email',
    type: String,
  },
  'DOB': {
    prop: 'dob',
    type: Date,
    dateFormat: 'YYYY-MM-DD'
  },
};
