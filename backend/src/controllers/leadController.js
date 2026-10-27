const Lead = require('../models/Lead');

/**
 * @route   POST /api/leads
 * @desc    Submit a new business lead inquiry (from "Apply Now" modal)
 * @access  Public
 */
const createLead = async (req, res, next) => {
  try {
    const { id, name, business, city, industry, phone, date } = req.body;

    if (!name || !business || !phone) {
      return res.status(400).json({
        success: false,
        error: 'name, business, and phone are required fields',
      });
    }

    const lead = await Lead.create({
      id: id || `lead_${Date.now()}`,
      name: name.trim(),
      business: business.trim(),
      city: city ? city.trim() : '',
      industry: industry || 'General',
      phone: phone.trim(),
      date: date || undefined,
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry lead submitted successfully',
      lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/leads
 * @desc    Get all inquiry leads
 * @access  Protected
 */
const getLeads = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { business: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead inquiry
 * @access  Protected
 */
const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    let lead = await Lead.findOneAndDelete({ id });
    if (!lead && id.match(/^[0-9a-fA-F]{24}$/)) {
      lead = await Lead.findByIdAndDelete(id);
    }

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: `Lead with id "${id}" not found`,
      });
    }

    return res.json({
      success: true,
      message: `Lead from "${lead.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/leads/:id/status
 * @desc    Update lead status (new, contacted, converted, closed)
 * @access  Protected
 */
const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    let lead = await Lead.findOneAndUpdate({ id }, { $set: updates }, { new: true });
    if (!lead && id.match(/^[0-9a-fA-F]{24}$/)) {
      lead = await Lead.findByIdAndUpdate(id, { $set: updates }, { new: true });
    }

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: `Lead with id "${id}" not found`,
      });
    }

    return res.json({
      success: true,
      message: 'Lead updated successfully',
      lead,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  deleteLead,
  updateLeadStatus,
};
