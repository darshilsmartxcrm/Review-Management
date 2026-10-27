const Client = require('../models/Client');

/**
 * @route   GET /api/clients
 * @desc    Get all clients (or single client if ?id= is specified)
 * @access  Public / Protected
 */
const getClients = async (req, res, next) => {
  try {
    const { id, category, search, status } = req.query;

    // Backward compatibility: If ?id=client_1 is passed (as in frontend /api/clients?id=...)
    if (id) {
      const client = await Client.findOne({ id });
      if (client) {
        return res.json({ success: true, client });
      }
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { person_name: { $regex: q, $options: 'i' } },
        { keywords: { $regex: q, $options: 'i' } },
      ];
    }

    let clients = await Client.find(filter).sort({ createdAt: -1 });

    // Optional status filter: active, upcoming, expired
    if (status && status !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      clients = clients.filter((c) => {
        const start = c.start_date || '2000-01-01';
        const expiry = c.expiry_date || '2099-12-31';
        if (status === 'active') {
          return today >= start && today <= expiry;
        } else if (status === 'upcoming') {
          return today < start;
        } else if (status === 'expired') {
          return today > expiry;
        }
        return true;
      });
    }

    return res.json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/clients/:id
 * @desc    Get single client by ID
 * @access  Public
 */
const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let client = await Client.findOne({ id });

    // If not found by custom id, check MongoDB _id
    if (!client && id.match(/^[0-9a-fA-F]{24}$/)) {
      client = await Client.findById(id);
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        error: `Client with id "${id}" not found`,
      });
    }

    return res.json({
      success: true,
      client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/clients
 * @desc    Create new client OR bulk insert/upsert (backward-compatible with frontend)
 * @access  Protected
 */
const createClient = async (req, res, next) => {
  try {
    const body = req.body;

    // Handle bulk array upload (matches saveStoredClients fetch('/api/clients', { body: JSON.stringify(clients) }))
    if (Array.isArray(body)) {
      const ops = body.map((c) => ({
        updateOne: {
          filter: { id: c.id },
          update: { $set: c },
          upsert: true,
        },
      }));
      await Client.bulkWrite(ops);
      const all = await Client.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        message: 'Clients synced successfully',
        count: all.length,
        clients: all,
      });
    }

    // Handle single client creation or upsert
    const { id, name, person_name, category, city, google_url, phone, keywords, default_lang, start_date, expiry_date } = body;

    if (!name || !google_url || !phone) {
      return res.status(400).json({
        success: false,
        error: 'name, google_url, and phone are required fields',
      });
    }

    const clientId = id || `client_${Date.now()}`;

    const client = await Client.findOneAndUpdate(
      { id: clientId },
      {
        id: clientId,
        name: name.trim(),
        person_name: person_name ? person_name.trim() : '',
        category: category || 'surgical_medical',
        city: city ? city.trim() : '',
        google_url: google_url.trim(),
        phone: phone.trim(),
        keywords: keywords ? keywords.trim() : '',
        default_lang: default_lang || 'gu',
        start_date: start_date || new Date().toISOString().split('T')[0],
        expiry_date: expiry_date,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Client saved successfully',
      client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/clients/:id
 * @desc    Update client by ID
 * @access  Protected
 */
const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let client = await Client.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!client && id.match(/^[0-9a-fA-F]{24}$/)) {
      client = await Client.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        error: `Client with id "${id}" not found`,
      });
    }

    return res.json({
      success: true,
      message: 'Client updated successfully',
      client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/clients/:id
 * @desc    Delete client by ID
 * @access  Protected
 */
const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    let result = await Client.findOneAndDelete({ id });
    if (!result && id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Client.findByIdAndDelete(id);
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        error: `Client with id "${id}" not found`,
      });
    }

    return res.json({
      success: true,
      message: `Client "${result.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
