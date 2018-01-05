$(document).ready(function() {
	// ===================================
	// Init Authentication to Yotpo API
	// ===================================
	// Reference:
	// http://apidocs.yotpo.com/reference#general-information
	// 
	// Go to the Yotpo app, on the top right, click on the user icon,
	// then click account settings, then the store tab. You will need the API
	// credentials to login first.
	// ===================================

	var yotpoAuthUrl = 'https://api.yotpo.com/oauth/token',
			credentials = {
				"client_id": "CLIENT_API_KEY",
				"client_secret": "CLIENT_API_SECRET",
				"grant_type": "client_credentials"
			},
			accessToken = '',
			initYotpoAuth = $.ajax({
				url: yotpoAuthUrl,
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(credentials),
				success: function(response){
					console.log('Auth successful!');
				}
			});

	// ==============================================
	// After auth, specify the platform_type_id youre using. 
	// Shopify is 1,
	// Bigcommerce is 3,
	// Magento is 5
	// ==============================================
	// You can find the shop domain above the API keys
	// in Yotpo's account settings.
	// ==============================================

	initYotpoAuth.done(function(data) {
		// Get access token. You will need this when accessing the API
		accessToken = data.access_token;

		// Data for AJAX request
		var data = {
			"account_platform": {
				"platform_type_id": 1,
				"shop_domain": "https://CLIENT.WEBSITE.COM"
			},
			"utoken": accessToken
		};

		// You will also need your api key per request. 
		var appKey = 'CLIENT_API_KEY';

		// For getting reviews, specify review count
		var count = 40;

		// Begin querying! This example is for getting the latest 40 Reviews
		$.ajax({
			url: 'https://api.yotpo.com/v1/apps/'+appKey+'/reviews?utoken='+accessToken+'&count='+count+'',
			type: 'GET',
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json',
			success: function(response) {
				// See the json on your log!
				console.log(reponse);

				// Do whatever else you want below!

			}
		});
	});
});