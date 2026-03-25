const Internship = require('../models/Internship');

// Admin: Create internship
exports.createInternship = async (req, res) => {
    try {
        const internship = new Internship(req.body);
        await internship.save();
        res.status(201).json({ success: true, data: internship });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Admin: Get all internships
exports.getAllInternships = async (req, res) => {
    try {
        const internships = await Internship.find();
        res.status(200).json({ success: true, data: internships });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Admin: Edit internship
exports.updateInternship = async (req, res) => {
    try {
        const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!internship) return res.status(404).json({ success: false, error: 'Not found' });
        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Admin: Delete internship
exports.deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findByIdAndDelete(req.params.id);
        if (!internship) return res.status(404).json({ success: false, error: 'Not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Teacher: View assigned internships
exports.getAssignedInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ teacher: req.user._id });
        res.status(200).json({ success: true, data: internships });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Teacher: Add syllabus item
exports.addSyllabus = async (req, res) => {
    try {
        const { item } = req.body;
        if (!item) return res.status(400).json({ success: false, error: 'Syllabus item is required' });

        const internship = await Internship.findOne({ _id: req.params.id, teacher: req.user._id });
        if (!internship) return res.status(404).json({ success: false, error: 'Internship not found or not assigned to you' });

        internship.syllabus.push(item);
        await internship.save();
        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Teacher: Remove syllabus item
exports.removeSyllabus = async (req, res) => {
    try {
        const { itemIndex } = req.params;
        const internship = await Internship.findOne({ _id: req.params.id, teacher: req.user._id });
        if (!internship) return res.status(404).json({ success: false, error: 'Internship not found or not assigned to you' });

        const index = parseInt(itemIndex, 10);
        if (index >= 0 && index < internship.syllabus.length) {
            internship.syllabus.splice(index, 1);
            await internship.save();
            res.status(200).json({ success: true, data: internship });
        } else {
            res.status(400).json({ success: false, error: 'Invalid syllabus index' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Teacher: Create a new batch for an internship
exports.createBatch = async (req, res) => {
    try {
        const { batchName, students } = req.body;
        if (!batchName) return res.status(400).json({ success: false, error: 'Batch name is required' });

        const internship = await Internship.findOne({ _id: req.params.id, teacher: req.user._id });
        if (!internship) return res.status(404).json({ success: false, error: 'Internship not found or not assigned to you' });

        // Ensure students array exists and contains valid ObjectIds (if provided)
        const studentIds = students ? students : [];

        internship.batches.push({ batchName, students: studentIds });
        await internship.save();

        res.status(201).json({ success: true, data: internship });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Teacher: Add student to a batch
exports.addStudentToBatch = async (req, res) => {
    try {
        const { studentId } = req.body;
        const { batchId } = req.params;

        if (!studentId) return res.status(400).json({ success: false, error: 'Student ID is required' });

        const internship = await Internship.findOne({ _id: req.params.id, teacher: req.user._id });
        if (!internship) return res.status(404).json({ success: false, error: 'Internship not found or not assigned to you' });

        const batch = internship.batches.id(batchId);
        if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });

        if (!batch.students.includes(studentId)) {
            batch.students.push(studentId);
            await internship.save();
        }

        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Teacher: Remove student from a batch
exports.removeStudentFromBatch = async (req, res) => {
    try {
        const { studentId, batchId } = req.params;

        const internship = await Internship.findOne({ _id: req.params.id, teacher: req.user._id });
        if (!internship) return res.status(404).json({ success: false, error: 'Internship not found or not assigned to you' });

        const batch = internship.batches.id(batchId);
        if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });

        batch.students = batch.students.filter(id => id.toString() !== studentId);
        await internship.save();

        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
