const express = require('express');
const {addCharacter,getAllCharacters, getCharacterByName, updateCharacterByName, deleteCharacterByName } = require('../controllers/characterController.js');
const { characterValidationRules, validate } = require('../validation');

const router = express.Router();

router.post('/', characterValidationRules(), validate, addCharacter);
router.get('/', getAllCharacters);
router.get('/name/:name', getCharacterByName);
router.put('/name/:name', characterValidationRules(), validate, updateCharacterByName);
router.delete('/name/:name', deleteCharacterByName);

module.exports = router;

