const Setting = require('../models/Setting');

/**
 * @route   GET /api/settings
 * @desc    Get agency settings (e.g. agency master WhatsApp phone)
 * @access  Public
 */
const getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.getSingleton();
    return res.json({
      success: true,
      settings: {
        agencyPhone: settings.agencyPhone,
        agencyName: settings.agencyName,
        supportEmail: settings.supportEmail,
        reviewLockHours: settings.reviewLockHours,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/settings OR PUT /api/settings
 * @desc    Update agency settings
 * @access  Protected (or public for seamless transition)
 */
const updateSettings = async (req, res, next) => {
  try {
    const { agencyPhone, agencyName, supportEmail, reviewLockHours } = req.body;

    const settings = await Setting.getSingleton();

    if (agencyPhone !== undefined) {
      settings.agencyPhone = String(agencyPhone).trim();
    }
    if (agencyName !== undefined) {
      settings.agencyName = String(agencyName).trim();
    }
    if (supportEmail !== undefined) {
      settings.supportEmail = String(supportEmail).trim();
    }
    if (reviewLockHours !== undefined) {
      settings.reviewLockHours = Number(reviewLockHours) || 24;
    }

    await settings.save();

    return res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        agencyPhone: settings.agencyPhone,
        agencyName: settings.agencyName,
        supportEmail: settings.supportEmail,
        reviewLockHours: settings.reviewLockHours,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
