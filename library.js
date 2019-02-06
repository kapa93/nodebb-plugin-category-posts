'use strict';

const controllers = require('./lib/controllers');
var nconf = require.main.require('nconf');
var async = require.main.require('async');

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
	router.render('partials/nodebb-plugin-category-posts/header', function (err, html) {
		if (err) {
			return callback(err);
		}
		widget.html = html;
		callback(null, widget);
	});
}

function renderExternal(req, res, next) {
	res.render('partials/nodebb-plugin-category-posts/header');
}

module.exports = plugin;
