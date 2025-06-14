const Major = require('../models/majors');

exports.listMajors = async (req, res) => {
    try {
        const majors = await Major.find({});
        res.render('majors', { majors, user: req.session.user });
    } catch (err) {
        res.status(500).send('Error fetching majors');
    }
};

exports.renderMajor = async (req, res) => {
    const major = await Major.findOne({ slug: req.params.major });
    if (!major) return res.status(404).send('Major not found');
    res.render('mainMajor', { major, user: req.session.user }); // <-- render mainMajor.ejs
};

exports.renderSubmajor = async (req, res) => {
    try {
 const major = await Major.findOne({ slug: req.params.major.toLowerCase() }).lean();
    if (!major) 
        return res.status(404).send('Major not found');

 const submajor = major.submajors.find(sub => sub.slug && sub.slug.toLowerCase() === req.params.submajor.toLowerCase());
    if (!submajor) 
        return res.status(404).send('Submajor not found');

    res.render('submajor', { major, submajor, user: req.session.user });
    } catch (err) {
        console.error("Error fetching sub-major:", err);
        res.status(500).send("Server error");
    }
};
exports.addMajor = async (req, res) => {
    try {
        const { name, slug, img, submajors } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ error: "Major name and slug are required!" });
        }

        const existingMajor = await Major.findOne({ slug });
        if (existingMajor) {
            return res.status(400).json({ error: `Major with slug '${slug}' already exists!` });
        }

        // ✅ Ensure all submajors have a valid slug
        const validSubmajors = (submajors || []).map(submajor => ({
            name: submajor.name,
            slug: submajor.slug && submajor.slug.trim().length > 0 
                ? submajor.slug.trim().replace(/\s+/g, "-").toLowerCase() 
                : `${slug}-${submajor.name.trim().replace(/\s+/g, "-").toLowerCase()}`
        }));

        const newMajor = new Major({
            name,
            slug,
            img,
            submajors: validSubmajors
        });

        await newMajor.save();
        res.status(200).json({ message: "Major added successfully!" });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};

