'use strict';

const controllers = require('./lib/controllers');
var topics = require.main.require('./src/topics');

const plugin = {};

plugin.init = function (params, callback) {
  const router = params.router;
  const hostMiddleware = params.middleware;
  // const hostControllers = params.controllers;

  // We create two routes for every view. One API call, and the actual route itself.
  // Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

  router.get('/admin/plugins/categoryposts', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
  router.get('/api/admin/plugins/categoryposts', controllers.renderAdminPage);

  router.get('/plugins/nodebb-plugin-category-posts/render', renderExternal);

  callback();
};

plugin.addAdminNavigation = function (header, callback) {
  header.plugins.push({
    route: '/plugins/categoryposts',
    icon: 'fa-tint',
    name: 'Category Posts',
  });

  callback(null, header);
};

plugin.defineWidgets = function(widgets, callback) {
  var widget = {
    widget: "categoryPosts",
    name: "Category Posts",
    description: "List of categories with their posts.",
  };
  router.render('admin/plugins/nodebb-plugin-category-posts/widget', {}, function (err, html) {
    if (err) {
      return callback(err);
    }
    widget.content = html;
    widgets.push(widget);
    callback(null, widgets);
  });
};

plugin.renderWidget = function(widget, callback) {
	var data = {
		templateData: {
			config: {
				relative_path: nconf.get('relative_path'),
			},
		},
		req: {
			uid: widget.uid,
		},
		cid: widget.data.cid || 0,
	};

	plugin.getCategories(data, function(err, data) {
		if (err) {
			return callback(err);
		}

		router.render('partials/nodebb-plugin-category-posts/header', data.templateData, function (err, html) {
			if (err) {
				return callback(err);
			}
			widget.html = html;
			callback(null, widget);
		});
	});
}

function renderExternal(req, res, next) {
	plugin.getCategories({
		templateData: {}
	}, function(err, data) {
		if (err) {
			return next(err);
		}

		data.templateData.relative_url = data.relative_url;
		data.templateData.config = {
			relative_path: nconf.get('url')
		};

		res.render('partials/nodebb-plugin-category-posts/header', data.templateData);
	});
}

plugin.getCategories = function(data, callback) {
	var uid = data.req ? data.req.uid : 0;
	var filterCid = data.cid;

	if (err) {
		return callback(err);
	}

	var i = 0;
	var cids = [];
	var finalTopics = [];

	finalTopics = topics.topics;

	data.templateData.topics = finalTopics;

	callback(null, data);
};

module.exports = plugin;
