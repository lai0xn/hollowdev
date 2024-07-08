const Character = require('../character.model');

const addCharacter = async (req, res) => {
  try {
    const character = await Character.create(req.body);
    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCharacters = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const characters = await Character.find({}).skip(skip).limit(limit);
    const totalOfCharacters = await Character.countDocuments();

    res.status(200).json({
      totalOfCharacters,
      totalPages: Math.ceil(totalOfCharacters / limit),
      currentPage: page,
      limit,
      characters
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCharacterByName = async (req, res) => {
  try {
    const { name } = req.params;
    const character = await Character.findOne({ name });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    } else {
      res.status(200).json(character);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCharacterByName = async (req, res) => {
  try {
    const { name } = req.params;
    const character = await Character.findOneAndReplace({ name }, req.body);

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    } else {
      res.status(200).json(character);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCharacterByName = async (req, res) => {
  try {
    const { name } = req.params;
    const character = await Character.findOneAndDelete({ name });

    res.status(200).json(`${character.name} is deleted`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCharacter,
  getAllCharacters,
  getCharacterByName,
  updateCharacterByName,
  deleteCharacterByName
};
