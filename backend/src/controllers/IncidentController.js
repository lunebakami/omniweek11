const conn = require('../database/index');

module.exports = {
  async store(req, res) {
    const { title, description, value } = req.body;
    const ong_id = req.headers.authorization;

    const [id] = await conn('incidents').insert({
      title,
      description,
      value,
      ong_id,
    });

    return res.json({ id });
  },

  async index(req, res) {
    const { page = 1 } = req.query;

    const [count] = await conn('incidents').count();

    const incidents = await conn('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf',
      ]);

    res.header('X-Total-Count', count['count(*)']);

    return res.json(incidents);
  },

  async destroy(req, res) {
    const { id } = req.params;
    const ong_id = req.headers.authorization;

    const incident = await conn('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

    if (incident.ong_id !== ong_id) {
      return res.status(401).json({ error: 'Operation not permitted' });
    }

    await conn('incidents')
      .where('id', id)
      .delete();

    return res.status(204).send();
  },
};
