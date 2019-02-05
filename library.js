'use strict';

const controllers = require('./lib/controllers');

const plugin = {};

plugin.init = function (params, callback) {
	const router = params.router;
	const hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/category-posts', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/category-posts', controllers.renderAdminPage);

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
	app.render('admin/plugins/nodebb-plugin-category-posts/widget', {}, function (err, html) {
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

	app.render('partials/nodebb-plugin-category-posts/header', data.templateData, function (err, html) {
		if (err) {
			return callback(err);
		}
		widget.html = html;
		callback(null, widget);
	});
}

module.exports = plugin;
