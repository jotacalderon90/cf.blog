'use strict';

const controlador = require('./lib/04.api/controller');

module.exports = {
  /**
   * @swagger
   * /api/blog/total:
   *   get:
   *     tags:
   *       - Api
   *     summary: Obtener total de registros
   *     description: Obtener total de registros
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/blog/total')
  //@method(['get'])
  total: controlador.total,

  /**
   * @swagger
   * /api/blog/collection:
   *   get:
   *     tags:
   *       - Api
   *     summary: Obtener coleccion de registros
   *     description: Obtener coleccion de registros
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/blog/collection')
  //@method(['get'])
  collection: controlador.collection,
};
