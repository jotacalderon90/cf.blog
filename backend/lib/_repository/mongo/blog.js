'use strict';

const { DateTime } = require('luxon');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');

//const AppError = require('../../error');

const constants = require('../constants');

const mapRow = function (row) {
  row.id = row._id.toString();

  row.datefromnow = DateTime.fromISO(row.created, { zone: 'utc' }).setLocale('es').toRelative();
  row.datetitle = DateTime.fromISO(row.created).toFormat('cccc, dd LLLL yyyy, h:mm:ss');

  row.img =
    row.archivospublicos +
    '/assets/img/blog/' +
    row.domain +
    '.' +
    row.host +
    '/' +
    row.id +
    '.jpg';

  row.created = DateTime.fromISO(row.created, { zone: 'utc' }).toFormat('yyyy-MM-dd');
  row.updated = DateTime.fromISO(row.updated || row.created, { zone: 'utc' }).toFormat(
    'yyyy-MM-dd'
  );

  return row;
};

//const validId = /^[a-f0-9]{24}$/;

const name_collection = 'blog';

const defaultProjection = {
  title: 1,
  uri: 1,
  resume: 1,
  tag: 1,
  created: 1,
  host: 1,
  domain: 1,
};

const defaultLimit = 6;

module.exports = {
  total: async function (query, options) {
    try {
      const total = await mongodb.count(name_collection, query, options);

      if (isNaN(total)) {
        throw new Error(total);
      }

      return total;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.repositorio);
    }
  },

  collection: async function (query, options, asCursor, archivospublicos) {
    try {
      const collection = await mongodb.find(name_collection, query, options, asCursor);

      if (asCursor) {
        return collection;
      }

      if (!Array.isArray(collection)) {
        throw new Error(collection);
      }

      return collection.map((row) => {
        row.archivospublicos = archivospublicos;
        return mapRow(row);
      });
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  tags: async function (field, query) {
    try {
      const tags = await mongodb.distinct(name_collection, field, query);

      if (!Array.isArray(tags)) {
        throw new Error(tags);
      }

      return tags;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.tags + ' ' + constants.error.repositorio);
    }
  },

  create: async function () {
    throw new Error('no implementado');
  },

  read: async function () {
    throw new Error('no implementado');
  },

  update: async function () {
    throw new Error('no implementado');
  },

  delete: async function () {
    throw new Error('no implementado');
  },

  /*******************/
  /*Metodos para BLOG*/
  /*******************/

  getFirstRenderPage: async function (host, domain, category, archivospublicos) {
    try {
      const collection = await this.collection(
        {
          host: host,
          domain: domain,
          ...(category ? { tag_main: category } : {}),
          active: true,
        },
        {
          projection: defaultProjection,
          sort: {
            created: -1,
            title: 1,
          },
          limit: defaultLimit,
        },
        false,
        archivospublicos
      );

      return collection;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  getByUrl: async function (host, domain, url, archivospublicos) {
    try {
      const collection = await this.collection(
        {
          host: host,
          domain: domain,
          uri: url,
          active: true,
        },
        {},
        false,
        archivospublicos
      );

      return collection;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  getRelation: async function (host, domain, tag_main, title, archivospublicos) {
    try {
      const collection = await this.collection(
        {
          host: host,
          domain: domain,
          /*tag: {
            $in: [tag_main],
          },*/
          tag_main: tag_main,
          title: {
            $ne: title,
          },
          active: true,
        },
        {
          projection: defaultProjection,
          limit: defaultLimit,
        },
        false,
        archivospublicos
      );

      return collection;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  totalToApi: async function (host, domain, category_name) {
    try {
      const total = await this.total({
        host: host,
        domain: domain,
        ...(category_name ? { tag_main: category_name } : {}),
        active: true,
      });
      return total;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.repositorio);
    }
  },

  getCollectionToAPI: async function (
    host,
    domain,
    category,
    skip,
    sort_field,
    sort_type,
    archivospublicos
  ) {
    try {
      let sort = {
        created: -1,
        title: 1,
      };
      if (sort_field) {
        sort = {};
        sort[sort_field] = sort_type;
      }

      const collection = await this.collection(
        {
          host: host,
          domain: domain,
          ...(category ? { tag_main: category } : {}),
          active: true,
        },
        {
          projection: defaultProjection,
          sort: sort,
          limit: defaultLimit,
          skip: skip,
        },
        false,
        archivospublicos
      );

      return collection;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },
};
