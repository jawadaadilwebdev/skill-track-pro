/**
 * Seeds the database with a demo admin account, a demo user, and sample
 * skills/projects/certifications/goals — useful for quickly demoing the
 * app to recruiters without manually creating data.
 *
 * Usage: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Certification = require('./models/Certification');
const Goal = require('./models/Goal');

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({}),
    Project.deleteMany({}),
    Certification.deleteMany({}),
    Goal.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@skilltrack.dev',
    password: 'admin123',
    role: 'admin',
  });

  const demoUser = await User.create({
    name: 'Demo User',
    email: 'demo@skilltrack.dev',
    password: 'demo1234',
    role: 'user',
    bio: 'Aspiring full-stack developer passionate about building great products.',
  });

  const skills = await Skill.insertMany([
    { user: demoUser._id, name: 'React.js', category: 'Frontend', proficiency: 85, level: 'Advanced' },
    { user: demoUser._id, name: 'Node.js', category: 'Backend', proficiency: 75, level: 'Intermediate' },
    { user: demoUser._id, name: 'MongoDB', category: 'Database', proficiency: 65, level: 'Intermediate' },
    { user: demoUser._id, name: 'Docker', category: 'DevOps', proficiency: 40, level: 'Beginner' },
    { user: demoUser._id, name: 'Tailwind CSS', category: 'Frontend', proficiency: 90, level: 'Expert' },
  ]);

  await Project.insertMany([
    {
      user: demoUser._id,
      title: 'SkillTrack Pro',
      description: 'A full-stack MERN platform for tracking skills, projects, and certifications.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      status: 'Completed',
      relatedSkills: [skills[0]._id, skills[1]._id, skills[2]._id],
    },
    {
      user: demoUser._id,
      title: 'E-commerce API',
      description: 'RESTful API for an e-commerce platform with JWT auth and Stripe integration.',
      techStack: ['Express', 'MongoDB', 'Stripe'],
      status: 'In Progress',
    },
  ]);

  await Certification.insertMany([
    {
      user: demoUser._id,
      title: 'Meta Front-End Developer Certificate',
      issuer: 'Meta (Coursera)',
      issueDate: new Date('2024-03-15'),
    },
  ]);

  await Goal.insertMany([
    {
      user: demoUser._id,
      title: 'Master TypeScript',
      description: 'Complete an advanced TypeScript course and refactor a project.',
      progress: 30,
      status: 'In Progress',
      relatedSkill: skills[0]._id,
    },
    {
      user: demoUser._id,
      title: 'Get AWS Certified',
      progress: 0,
      status: 'Not Started',
    },
  ]);

  console.log('✅ Seed complete');
  console.log('   Admin login: admin@skilltrack.dev / admin123');
  console.log('   Demo login:  demo@skilltrack.dev / demo1234');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
