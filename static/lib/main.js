'use strict';

/* globals document, $ */

$(document).ready(function () {
	/*
		This file shows how client-side javascript can be included via a plugin.
		If you check `plugin.json`, you'll see that this file is listed under "scripts".
		That array tells NodeBB which files to bundle into the minified javascript
		that is served to the end user.

		Some events you can elect to listen for:

		$(document).ready();			Fired when the DOM is ready
		$(window).on('action:ajaxify.end', function(data) { ... });			"data" contains "url"
	*/

	/*
	var categories = [{name: 'catalytic', id: '5'}, {name: 'announcements', id: '1'}]

	function getPosts(category) {
	    $.ajax({url: 'http://localhost:4567/api/category/' + category.id + '/' + category.name, success: function(result){
		  	$('#' + category.name + '-cat').append(JSON.stringify(result));
		  	for (i = 0; i < result.topics.length; i++) {
		  		var topicName = result.topics[i].title;
	      	console.log(topicName);
	      }
	  	}});
	}

	for (i = 0; i < categories.length; i++) {
	    getPosts(categories[i]);
	}
	*/

	console.log('nodebb-plugin-category-posts: loaded');
	// Note how this is shown in the console on the first load of every page
});
