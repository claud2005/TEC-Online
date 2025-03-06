const express = require('express');
const User = require('../models/User'); // Importando o modelo User
const router = express.Router();

// Buscar perfil do usuário
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Atualizar perfil do usuário
router.put('/:id', async (req, res) => {
  try {
    const { username, email, profilePicture, bio } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePicture = profilePicture || user.profilePicture;
    user.bio = bio || user.bio;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar perfil' });
  }
});

module.exports = router;
