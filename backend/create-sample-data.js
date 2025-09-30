const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const Page = require('./models/pageModel');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE || 'mongodb://localhost:27017/dhyey-production';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.log('DB connection failed:', err));

const createSampleData = async () => {
  try {
    // Create categories
    const categories = [
      {
        name: 'Adventure',
        slug: 'adventure',
        description: 'Thrilling tales of exploration and discovery'
      },
      {
        name: 'Fantasy',
        slug: 'fantasy',
        description: 'Magical worlds and mythical creatures'
      },
      {
        name: 'Romance',
        slug: 'romance',
        description: 'Love stories that touch the heart'
      },
      {
        name: 'Mystery',
        slug: 'mystery',
        description: 'Puzzles and secrets waiting to be solved'
      },
      {
        name: 'General',
        slug: 'general',
        description: 'General stories and narratives'
      }
    ];

    await Category.deleteMany({});
    const createdCategories = await Category.create(categories);
    console.log('Categories created:', createdCategories.length);

    // Create pages
    const pages = [
      {
        title: 'About Dhyey Production',
        slug: 'about-dhyey-production',
        body: `<h1>About Dhyey Production</h1>
<p>Welcome to Dhyey Production, where stories come alive and imagination knows no bounds. Founded with a vision to create a platform where storytellers from around the world can share their narratives, we believe in the power of stories to connect, inspire, and transform lives.</p>

<h2>Our Mission</h2>
<p>At Dhyey Production, our mission is to democratize storytelling by providing a platform where every voice can be heard. Whether you're a seasoned author or someone with a story burning inside you, we're here to help you share it with the world.</p>

<h2>What We Offer</h2>
<ul>
<li><strong>Creative Freedom:</strong> Write in any genre, any style, any length</li>
<li><strong>Global Audience:</strong> Connect with readers from around the world</li>
<li><strong>Community Support:</strong> Join a community of passionate storytellers</li>
<li><strong>Professional Tools:</strong> Access to editing and publishing tools</li>
</ul>

<h2>Join Our Story</h2>
<p>Whether you're here to read, write, or both, you're part of the Dhyey Production family. Together, we're building a world where every story matters and every voice is heard.</p>`,
        metaDescription: 'Learn about Dhyey Production, a storytelling platform where writers and readers connect through the power of narrative.',
        isPublished: true
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        body: `<h1>Privacy Policy</h1>
<p>Last updated: September 30, 2024</p>

<h2>Information We Collect</h2>
<p>We collect information you provide directly to us, such as when you create an account, publish a story, or contact us for support.</p>

<h2>How We Use Your Information</h2>
<p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and protect our platform and users.</p>

<h2>Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us at privacy@dhyeyproduction.com</p>`,
        metaDescription: 'Dhyey Production privacy policy explaining how we collect, use, and protect your personal information.',
        isPublished: true
      }
    ];

    await Page.deleteMany({});
    const createdPages = await Page.create(pages);
    console.log('Pages created:', createdPages.length);

    console.log('Sample data created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating sample data:', err);
    process.exit(1);
  }
};

createSampleData();
