'use strict';

const controllers = require('./lib/controllers');
var nconf = require.main.require('nconf');
var async = require.main.require('async');

var plugin = module.exports;
var router;

plugin.init = function (params, callback) {
	router = params.router;
	var hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/category-posts', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/category-posts', controllers.renderAdminPage);
	router.get('/plugins/nodebb-plugin-category-posts/render', renderExternal);

	callback();
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/category-posts',
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

	router.render('partials/nodebb-plugin-category-posts/header', function (err, html) {
		if (err) {
			return callback(err);
		}
		widget.html = html;
		callback(null, widget);
	});
}

function renderExternal(req, res, next) {
	res.render('partials/nodebb-plugin-recent-cards-min/header', data.templateData);
}

module.exports = plugin;
