'use strict';

const controllers = require('./lib/controllers');
var nconf = require.main.require('nconf');
var async = require.main.require('async');
var categories = require.main.require('./src/categories');
var validator = require.main.require('validator');
var topics = require.main.require('./src/topics');
var settings = require.main.require('./src/settings');
var groups = require.main.require('./src/groups');
var socketAdmin = require.main.require('./src/socket.io/admin');
var plugin = module.exports;
var router;

plugin.init = function (params, callback) {
	router = params.router;
	var hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

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

	categories.getCategoriesByPrivilege('cid:0:children', widget.uid, 'find', function(err, data) {
		if (err) {
			return callback(err);
		}
		app.render('partials/nodebb-plugin-category-posts/header', {
			categories: data.templateData,
			relative_path: nconf.get('relative_path')
		}, function (err, html) {
			widget.html = html;
			callback(err, widget);
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

module.exports = plugin;
