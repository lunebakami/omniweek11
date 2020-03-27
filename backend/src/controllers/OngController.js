const conn = require('../database/index');
const crypto = require('crypto');

module.exports = {
  async store(req, res) {
    const { name, email, whatsapp, city, uf } = req.body;

    const id = crypto.randomBytes(4).toString('HEX');

    await conn('ongs').insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf,
    });

    return res.json({ id });
  },

  async index(req, res) {
    const ongs = await conn('ongs').select('*');

    return res.json(ongs);
  },
};
