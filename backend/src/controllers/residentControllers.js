import Resident from "../models/residentModel.js";

//get all residents
export const getAllResidents = async (req, res) => {
  try {
    const allResidents = await Resident.find()
      .populate("user", "name email")
      .populate("desireRoom", "roomNumber roomType");
    res.status(200).json(allResidents);
  } catch (error) {
    res.status(500).json({ message: "No resident is found" });
  }
};

//get each resident
export const getEachResident = async (req, res) => {
  try {
    const { id } = req.params;
    const residentById = await Resident.findById(id);
    if (!residentById) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.status(200).json(residentById);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create resident

export const createResident = async (req, res) => {
  try {
    const resident = await Resident.create(req.body);
    res.status(201).json(resident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update a resident
export const updateResident = async (req, res) => {
  try {
    const resident = await Resident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!resident)
      return res.status(404).json({ message: "Resident not found" });
    res.status(200).json(resident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete a resident
export const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResident = await Resident.findByIdAndDelete(id);
    if (!deletedResident)
      return res.status(404).json({ message: "Resident not found" });
    res.status(200).json({ message: "Resident is deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
