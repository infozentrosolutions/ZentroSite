const InternPerson = require('../models/InternPerson');

const normalizeString = (value) => {
    if (value === undefined || value === null) return '';
    return String(value).trim();
};

const mapInternPayload = (payload = {}) => ({
    name: normalizeString(payload.name),
    email: normalizeString(payload.email).toLowerCase(),
    phone: normalizeString(payload.phone),
    role: normalizeString(payload.role) || 'Intern',
    batch: normalizeString(payload.batch),
    stack: normalizeString(payload.stack),
    summary: normalizeString(payload.summary),
    photoUrl: normalizeString(payload.photoUrl),
    internId: normalizeString(payload.internId),
    status: payload.status === 'inactive' ? 'inactive' : 'active'
});

exports.getInternPeople = async (req, res) => {
    try {
        const internPeople = await InternPerson.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: internPeople });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getPublicInternPersonById = async (req, res) => {
    try {
        const { id } = req.params;
        const internPerson = await InternPerson.findById(id);

        if (!internPerson) {
            return res.status(404).json({ success: false, error: 'Intern person not found' });
        }

        res.status(200).json({ success: true, data: internPerson });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createInternPerson = async (req, res) => {
    try {
        const internData = mapInternPayload(req.body);

        if (!internData.name || !internData.email) {
            return res.status(400).json({ success: false, error: 'Name and email are required' });
        }

        const internPerson = await InternPerson.create(internData);
        res.status(201).json({ success: true, data: internPerson });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.bulkUpsertInternPeople = async (req, res) => {
    try {
        const internPeople = Array.isArray(req.body.internPeople) ? req.body.internPeople : [];

        if (!internPeople.length) {
            return res.status(400).json({ success: false, error: 'Intern people data is required' });
        }

        const results = [];

        for (const person of internPeople) {
            const internData = mapInternPayload(person);

            if (!internData.name || !internData.email) {
                continue;
            }

            const savedPerson = await InternPerson.findOneAndUpdate(
                { email: internData.email },
                internData,
                { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
            );
            results.push(savedPerson);
        }

        res.status(200).json({ success: true, data: results, message: `Imported ${results.length} intern people` });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateInternPerson = async (req, res) => {
    try {
        const internData = mapInternPayload(req.body);

        if (!internData.name || !internData.email) {
            return res.status(400).json({ success: false, error: 'Name and email are required' });
        }

        const internPerson = await InternPerson.findByIdAndUpdate(req.params.id, internData, {
            new: true,
            runValidators: true
        });

        if (!internPerson) {
            return res.status(404).json({ success: false, error: 'Intern person not found' });
        }

        res.status(200).json({ success: true, data: internPerson });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteInternPerson = async (req, res) => {
    try {
        const internPerson = await InternPerson.findByIdAndDelete(req.params.id);

        if (!internPerson) {
            return res.status(404).json({ success: false, error: 'Intern person not found' });
        }

        res.status(200).json({ success: true, message: 'Intern person deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};