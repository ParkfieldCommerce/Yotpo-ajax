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

	// ==============================================
	// Specify the platform_type_id youre using. 
	// Shopify is 1,
	// Bigcommerce is 3,
	// Magento is 5
	// ==============================================
	// You can find the shop domain above the API keys
	// in Yotpo's account settings.
	// ============================================== 

	// ===================================
	// Global Control Center
	// In Google We Trust
	// ===================================
	var client_api_key = "CLIENT_API_KEY";
	var client_secret = "CLIENT_API_SECRET";
	var platform_type_id = 1;
	var shop_domain = "https://CLIENT.WEBSITE.COM";

	// Number of reviews to pull
	var review_count = 40;
	

	// ====================================================
	// Init Yotpo API Auth
	var yotpoAuthUrl = 'https://api.yotpo.com/oauth/token',
			credentials = {
				"client_id": client_api_key,
				"client_secret": client_secret,
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

	// ==================================
	// Prerequisites
	// ==================================

	// Format Review Date
	function formatDate(date) {
    var month = date.getMonth(),
        day = date.getDate().toString(),
        year = date.getFullYear();

    year = year.toString().substr(-2);
    month = (month + 1).toString();  
    return month + "/" + day + "/" + year;
  }

  // Humanize Strings
  function humanize(str) {
  	var frags = str.split('_');
  	for (i=0; i<frags.length; i++) {
  		frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  	}
  	return frags.join(' ');
  }

  // Star Rating
  // ===================================================================
  // 
  // For CSS in half star, use :after element with absolute positioning
  // HTML Use
  // <span class="stars" data-rating="review.score" data-num-stars="5"></span>
  // JS Call
  // $('.stars').stars();

  $.fn.stars = function () {

  	return $(this).each(function() {
  		var rating = $(this).data('rating'),
  				numStars = $(this).data('num-stars'),
  				fullStar = new Array(Math.floor(rating + 1)).join('<i class="fa fa-star"></i>'),
  				halfStar = ((rating%1) !== 0) ? '<i class="fa fa-star-half"></i>': '',
  				noStar = new Array(Math.floor(numStars + 1 - rating)).join('<i class="fa fa-star empty"></i>');

  		$(this).html(fullStar + halfStar + noStar);
  	});
  }

	initYotpoAuth.done(function(data) {
		// Get access token. You will need this when accessing the API
		accessToken = data.access_token;

		// Data for AJAX request
		var data = {
			"account_platform": {
				"platform_type_id": platform_type_id,
				"shop_domain": shop_domain
			},
			"utoken": accessToken
		};

		// Reviews Vote Calls
		// ** Call inside $.each **
		function yotpoReviewVote(review_id, vote_type) {
			$.ajax({
				url: 'https://api.yotpo.com/reviews/'+review_id+'/vote/'+vote_type+'',
				type: 'POST',
				data: JSON.stringify(data),
				dataType: 'json',
				contentType: 'application/json',
				success: function() {
					console.log('Review id: '+review_id+', Voted: '+vote_type+'');
				}
			});
		}

		// Reviews query
		$.ajax({
			url: 'https://api.yotpo.com/v1/apps/'+client_api_key+'/reviews?utoken='+accessToken+'&count='+review_count+'',
			type: 'GET',
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json',
			success: function(response) {

				// See the json on your log!
				console.log(response);

				// GET data for each response
				$.each( response.reviews, function(i, review) {
					// Review Variables 
					var reviewTitle = review.title,
              reviewContent = review.content,
              reviewDate = new Date(review.created_at),
              reviewDate = formatDate(reviewDate),
              reviewScore = review.score,
              reviewTotalScore = 5,
              reviewVoteUp = review.votes_up,
              reviewVoteDown = review.votes_down,
              reviewTotalVote = (reviewVoteUp - reviewVoteDown);
              reviewName = review.name,
              reviewId = review.id,
              reviewType = review.reviewer_type,
              reviewType = humanize(reviewType);

				});
			}
		});
	});
});