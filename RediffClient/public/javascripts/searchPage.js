$(document).ready(function() {
	var sf = new searchFunctionality();
	sf.init();
});

function searchFunctionality() {
	var that = this;
	var searchInput = $('#searchInput'),
		searchBtn = $('#searchBtn'),
		searchResultContainer = $('.search-results'),
		historyContainer = $('.search-history-container'),
		resContainer = searchResultContainer.parents('.res-container');
	this.init = function() {
		this.events();

		var socket = io();

		socket.on('newlogin', function(usersArray) {
			that.appendNewUser(usersArray);
		});

		var userData = {
			id: $('.user-details').data('userid'),
			name: $('.user-details').data('name')
		};
		socket.emit('newloginInit', userData);

		that.getSearchHistory();


	};

	this.appendNewUser = function(appendNewUser) {
		$.each(appendNewUser, function(i, data){
			$('.active-user-list').append('<li><a href="/userDetails?id=' + data.id + '"> ' + data.name + ' </li>');	
		});
		
	};


	this.events = function() {
		searchBtn.on('click', function() {
			var searchInputText = searchInput.val();
			if (searchInputText && searchInputText.length > 3) {
				that.searchRediff(searchInputText);
			}
		});
		historyContainer.on('click','a', function(e){
			e.preventDefault();
			var text = $(this).text();
			var searchString = text.substring(0,text.indexOf('--'));
			searchInput.val(searchString);
			searchBtn.trigger('click');
		});

	};
	this.cleanup = function() {
		resContainer.find('.items-found').remove();
		searchResultContainer.empty();

	};
	this.searchRediff = function(searchInputText) {
		this.cleanup();
		this.showLoader();
		$.ajax({
			url: '/searchProducts?query=' + searchInputText,
			method: 'get',
			success: that.paintResults,
			error: function(xhr, opts) {
				searchResultContainer.html('Sorry some error' + xhr);
			}
		});

	};
	this.showLoader = function() {
		searchResultContainer.html('<img class="loader" src="/images/ajax-loader.gif"></img>');
	};

	this.paintResults = function(data) {
		var lis = '';
		if (data) {
			data = $.parseJSON(data);
			var results = (data[0] && data[0].product) ? data[0].product : [];
			$.each(results, function(i, item) {
				lis += that.getResultItemTemplate(item);
			});

		}
		searchResultContainer.html(lis || data);


		var itemsFound = data[0].product.length || 0;

		resContainer.prepend('<h3 class="col-xs-12 items-found">Found ' + itemsFound + ' items</h3>');

		that.getSearchHistory();

	};

	this.getSearchHistory = function() {
		$.ajax({
			url: '/getSearchHistory',
			method: 'get',
			success: that.paintHistory,
			error: function(xhr, opts) {
				searchResultContainer.html('Sorry some error' + xhr);
			}
		});
	};

	this.paintHistory = function(data) {
		var historyList = $('.search-history');
		historyList.empty();
		if (!data.history.length) {
			historyList.append('<li class="list-group-item no-results">No recent searches</li>');

		}
		$.each(data.history, function(i, item) {
			historyList.append('<li class="list-group-item"><a href="' + item.url + '">' + item.searchKey + '</a></li>');
		});
	};

	this.getResultItemTemplate = function(item) {
		return '<li class="list-group-item">' +
			'<div class="col-xs-12 col-sm-6"><img src="' + item.image + '"></img></div>' +
			'<div class="col-xs-12 col-sm-6 well">' +
			'<div class="item-detail">' + item.name + '</div>  <div class="item-detail">Sold By: ' + item.vendor + '</div>  <div class="item-detail"> Price: Rs: ' + item.price + ' /- </div> <a href="' + item.url + '" class=" item-detail btn btn-primary"> See Details </a></div></li>';
	};

	this.emitSocketIOEvent = function() {

	};



}