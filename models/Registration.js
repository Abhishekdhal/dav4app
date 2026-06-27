const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
    default: '',
  },
  last_name: {
    type: String,
    default: '',
  },
  dob: {
    type: String,
    required: true,
  },
  birth_cert: {
    type: String,
    default: '',
  },
  age_words: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    required: true,
  },
  blood_group: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  caste: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  mother_tongue: {
    type: String,
    required: true,
  },
  aadhaar: {
    type: String,
    default: '',
  },
  special_need: {
    type: String,
    default: 'SELECT',
  },
  address_proof_doc: {
    type: String,
    default: '',
  },
  res_house: {
    type: String,
    default: '',
  },
  res_street: {
    type: String,
    default: '',
  },
  res_locality: {
    type: String,
    default: '',
  },
  res_po_ps: {
    type: String,
    default: '',
  },
  res_district: {
    type: String,
    default: '',
  },
  res_pin: {
    type: String,
    default: '',
  },
  res_state: {
    type: String,
    default: '',
  },
  res_country: {
    type: String,
    default: 'INDIA',
  },
  perm_house: {
    type: String,
    default: '',
  },
  perm_street: {
    type: String,
    default: '',
  },
  perm_locality: {
    type: String,
    default: '',
  },
  perm_po_ps: {
    type: String,
    default: '',
  },
  perm_district: {
    type: String,
    default: '',
  },
  perm_pin: {
    type: String,
    default: '',
  },
  perm_state: {
    type: String,
    default: '',
  },
  perm_country: {
    type: String,
    default: 'INDIA',
  },
  prev_school: {
    type: String,
    default: '',
  },
  prev_board: {
    type: String,
    default: '',
  },
  prev_medium: {
    type: String,
    default: '',
  },
  class_9_percent: {
    type: Number,
    default: 0.0,
  },
  class_10_percent: {
    type: Number,
    default: 0.0,
  },
  stream_choice: {
    type: String,
    default: '',
  },
  father_title: {
    type: String,
    default: '',
  },
  father_name: {
    type: String,
    default: '',
  },
  father_aadhaar: {
    type: String,
    default: '',
  },
  father_qual: {
    type: String,
    default: '',
  },
  father_income: {
    type: Number,
    default: 0.0,
  },
  father_occupation: {
    type: String,
    default: '',
  },
  father_alumni: {
    type: String,
    default: 'NO',
  },
  mother_title: {
    type: String,
    default: '',
  },
  mother_name: {
    type: String,
    default: '',
  },
  mother_aadhaar: {
    type: String,
    default: '',
  },
  mother_qual: {
    type: String,
    default: '',
  },
  mother_income: {
    type: Number,
    default: 0.0,
  },
  mother_occupation: {
    type: String,
    default: '',
  },
  mother_alumni: {
    type: String,
    default: 'NO',
  },
  sibling_boys: {
    type: Number,
    default: 0,
  },
  sibling_girls: {
    type: Number,
    default: 0,
  },
  sibling_total: {
    type: Number,
    default: 1,
  },
  is_sibling_studying: {
    type: String,
    default: 'NO',
  },
  is_transport_required: {
    type: String,
    default: 'NO',
  },
  student_photo_url: {
    type: String,
    required: true,
  },
  father_photo_url: {
    type: String,
    required: true,
  },
  mother_photo_url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Registration', RegistrationSchema);
