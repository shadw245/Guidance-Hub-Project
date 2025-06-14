const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { addMajor } = require('../controllers/major');
const majorController = require('../controllers/major');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './../uploads/pics'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

router.post('/majors', upload.any(), async (req, res) => {
  try {
    const { body, files } = req;

    const fileMap = {};
    files.forEach(file => {
      fileMap[file.fieldname] = file;
    });

    // Rename major image
    const slug = body.slug;
    const majorImgFile = fileMap['img'];
    const majorImgExt = path.extname(majorImgFile.originalname);
    const majorImgFilename = `${slug}${majorImgExt}`;
    const majorImgPath = path.join(__dirname, './../uploads/pics', majorImgFilename);
    fs.renameSync(majorImgFile.path, majorImgPath);

    // Reconstruct submajors
    const submajors = [];
    const submajorIndexes = new Set();

    Object.keys(body).forEach(key => {
      const match = key.match(/^submajors\[(\d+)\]\[name\]$/);
      if (match) submajorIndexes.add(match[1]);
    });

    for (const idx of submajorIndexes) {
      const base = `submajors[${idx}]`;
      const subName = body[`${base}[name]`];
      const subSlug = body[`${base}[slug]`];
      const subImgField = `${base}[img]`;
      const subImgFile = fileMap[subImgField];
      if (!subName || !subSlug || !subImgFile) continue;

      const subImgExt = path.extname(subImgFile.originalname);
      const subImgFilename = `${subSlug}${subImgExt}`;
      const subImgPath = path.join(__dirname, './../uploads/pics', subImgFilename);
      fs.renameSync(subImgFile.path, subImgPath);

      const responsibilities = body[`${base}[responsibilities]`]
        ? body[`${base}[responsibilities]`].split(',').map(r => {
            const [name, description] = r.split(':').map(s => s.trim());
            return { name, description: description || "" };
          })
        : [];

      const careerPaths = body[`${base}[careerPaths]`]
        ? body[`${base}[careerPaths]`].split(',').map(cp => {
            const [title, description] = cp.split(':').map(s => s.trim());
            return { title, description: description || "" };
          })
        : [];

      submajors.push({
        name: subName,
        slug: subSlug,
        img: subImgFilename,
        description: body[`${base}[description]`],
        overview: body[`${base}[overview]`],
        responsibilities,
        careerPaths
      });
    }

    // Log reconstructed submajors for debugging
    console.log('Reconstructed submajors:', submajors);

    // Attach parsed data to req.body for controller
    req.body = {
      name: body.name,
      slug: body.slug,
      img: majorImgFilename,
      submajors
    };

    // Pass to controller
    await addMajor(req, res);
  } catch (err) {
    console.error('Error in route /majors:', err);
    res.status(500).json({ error: 'Failed to handle major creation', details: err.message });
  }
});
router.get('/majors', majorController.listMajors);
router.get('/majors/:major', majorController.renderMajor);
router.get('/majors/:major/:submajor', majorController.renderSubmajor);

router.post("/", async (req, res) => {
    try {
        const { name, slug, img, submajors } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ error: "Major name and slug are required!" });
        }

        const existingMajor = await Major.findOne({ slug });
        if (existingMajor) {
            return res.status(400).json({ error: `Major with slug '${slug}' already exists!` });
        }

        const newMajor = new Major({
            name,
            slug,
            img,
            submajors: Array.isArray(submajors) ? submajors : []
        });

        await newMajor.save();
        res.status(200).json({ message: "Major added successfully!" });

    } catch (error) {
        console.error("Detailed Backend Error:", error);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

router.post("/add-major", async (req, res) => {
    try {
        const { name, slug, img, submajors } = req.body;

        console.log("Received Submajors:", submajors);

        if (!name || !slug || !img) {
            return res.status(400).json({ error: "Major name, slug, and image are required!" });
        }

        const existingMajor = await Major.findOne({ slug });
        if (existingMajor) {
            return res.status(400).json({ error: `Major with slug '${slug}' already exists!` });
        }

        const validatedSubmajors = Array.isArray(submajors) ? submajors.map(sub => ({
            name: sub.name,
            slug: sub.slug ? sub.slug.trim().replace(/\s+/g, "-").toLowerCase() : `${slug}-${sub.name.trim().replace(/\s+/g, "-").toLowerCase()}`,
            img: sub.img,
            description: sub.description,
            responsibilities: sub.responsibilities || [],
            careerPaths: sub.careerPaths || []
        })) : [];

        console.log("Final Submajors Data:", validatedSubmajors);

        const newMajor = new Major({
            name,
            slug,
            img,
            submajors: validatedSubmajors
        });

        await newMajor.save();
        res.status(200).json({ message: "Major added successfully with submajors!" });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});
module.exports = router;