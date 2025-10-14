import Maintenance from "../models/maintenanceModel.js";

export const createMaintenanceReport = async (req, res) => {
  try {
    const maintenance = await Maintenance.create({
      ...req.body,
      resident: req.user.id,
    });
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReport = async (req, res) => {
  try {
    const requests = await Maintenance.find().populate(
      "resident",
      "name email"
    );
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
