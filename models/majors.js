const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  img: { type: String, required: true },
  submajors: [{
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    description: { type: String, required: true },  // ✅ Add sub-major description
     responsibilities: [{name: String, description: String }],  
    careerPaths: [{ title: String, description: String }]  // ✅ Store career paths
  }]
});

module.exports = mongoose.model('Major', majorSchema);