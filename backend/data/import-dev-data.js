const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Story = require('../models/Story');
const Category = require('../models/categoryModel');
const Page = require('../models/pageModel');

dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));
const pages = JSON.parse(fs.readFileSync(`${__dirname}/pages.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const stories = JSON.parse(fs.readFileSync(`${__dirname}/stories.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Category.create(categories);
    await User.create(users, { validateBeforeSave: false });
    await Story.create(stories);
    await Page.create(pages);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Category.deleteMany();
    await User.deleteMany();
    await Story.deleteMany();
    await Page.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
