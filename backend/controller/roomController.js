import Room from "../models/Room.js";

const normalizeDateStatuses = (dateStatuses = {}) => {
  if (!dateStatuses || typeof dateStatuses !== "object") {
    return {};
  }

  return Object.entries(dateStatuses).reduce((accumulator, [dateKey, status]) => {
    if (!dateKey) return accumulator;

    accumulator[dateKey] = status === "reserved" ? "reserved" : "available";
    return accumulator;
  }, {});
};

const normalizeRoomPayload = (body = {}) => {
  const status =
    body.status === "Occupied" || body.status === "Maintenance"
      ? body.status
      : "Available";

  return {
    ...body,
    status,
    available: status === "Available",
    dateStatuses: normalizeDateStatuses(body.dateStatuses),
  };
};

// CREATE room
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(normalizeRoomPayload(req.body));
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET one room
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE room
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      normalizeRoomPayload(req.body),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE room
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET featured rooms
export const getFeaturedRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ featured: true, available: true }).limit(4);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FILTER rooms
export const filterRooms = async (req, res) => {
  try {
    const { branch, type, available } = req.query;

    const query = {};

    if (branch) query.branch = branch;
    if (type) query.type = type;
    if (available !== undefined) query.available = available === "true";

    const rooms = await Room.find(query).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
