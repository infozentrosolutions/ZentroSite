const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const dummyStudents = [
  { name: 'Student One', email: 'student1@example.com' },
  { name: 'Student Two', email: 'student2@example.com' },
  { name: 'Student Three', email: 'student3@example.com' },
  { name: 'Student Four', email: 'student4@example.com' },
  { name: 'Student Five', email: 'student5@example.com' }
];

const seed = async () => {
  try {
    await connectDB();
    let createdStudents = [];
    for (const s of dummyStudents) {
      let student = await User.findOne({ email: s.email });
      if (!student) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash('password123', salt);
        student = await User.create({ ...s, password: hashed, role: 'student' });
        console.log('Created', s.email);
      } else {
        console.log('Already exists', s.email);
      }
      createdStudents.push(student);
    }

    // create a dummy internship and assign students if not exists
    const Internship = require('../models/Internship');
    let internship = await Internship.findOne({ title: 'Dummy Internship' });
    if (!internship) {
      internship = await Internship.create({
        title: 'Dummy Internship',
        description: 'This is a test internship',
        duration: 3,
        fee: 0,
        syllabus: ['Module 1', 'Module 2'],
        students: createdStudents.map(s => s._id)
      });
      console.log('Created dummy internship');
    } else {
      // add any missing student ids
      const ids = createdStudents.map(s => s._id.toString());
      const existing = internship.students.map(id=>id.toString());
      const toAdd = ids.filter(id=>!existing.includes(id));
      if (toAdd.length) {
        internship.students.push(...toAdd);
        await internship.save();
        console.log('Updated internship student list');
      }
    }

    // assign internship to each student
    for(const s of createdStudents){
      if(!s.internshipAssigned){
        s.internshipAssigned=internship._id;
        await s.save();
      }
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();