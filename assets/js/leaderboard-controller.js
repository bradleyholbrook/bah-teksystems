var clicks = [];
var updatePlayerScores;

function pollPlayers()
{
	
	// get selected record for select persistance
	var selected = $(".leaderboard .selected .name").text();
	
	// make a request for the remote values for syncronization
	updatePlayerScores = $.ajax('/index.php/player/index/'+selected).done( function(response)
		{
			// don't overwrite the html if a click is in process.
			if(clicks.length > 0) return;
			
			// display the results
			$(".leaderboard").html(response);
			
			// assign click action to new html div's.
			$(".leaderboard .player").click( function(e)
				{
					updatePlayerScores.abort();
					
					// handle selected item
					$(".leaderboard .player").each( function(){ $(this).removeClass('selected'); });
					$(this).addClass('selected');
					
					// set details name
					$(".details .name").html( $(".selected .name").html() );
					
					// change directions to statistics
					$(".none").addClass('hidden');
					$(".details").removeClass('hidden');
				}
			);
				
		}
	).always( function() // regardless of error, set the next call
		{
			setTimeout(pollPlayers, 1000);
		}
	);
}

/**
* jQuery ajax was only sending every 500ms, this bundles the clicks in an array and sends a group of clicks
* at one time.
* 
*/
function sendClick()
{
	if(clicks.length > 0)
	{
		var count = clicks.length;
		var name = clicks.pop();
		clicks = [];
		$.ajax('/index.php/player/score/'+name+'/'+count).done(function(){ clicked = false; });
	}
}


$(document).ready( function(){
	
	/**
	* Start the player poll for data.
	*/
	pollPlayers();
	
	/**
	* fast click to work around 300ms delay between clicks on tablets / mobiles
	*/
	$(".inc").fastClick(function(){
		
		// don't let incoming remote data display while a click is in progress
		// we'll get the correct number in the end and avoid a yo-yo effect
		// in the number display
		updatePlayerScores.abort();
		clicks.push($(".selected .name").text());
		
		$(".selected .score").html( ($(".selected .score").html() - -5) );
		
		$('div.player').sort( function(a,b)
			{
				var p = "0000000";
				var sA = $(a).find('.score').text();
				var nA = $(a).find('.name').text();
				var sB = $(b).find('.score').text();
				var nB = $(b).find('.name').text();
				
				sA = p.substr(0, p.length - sA.length) + sA;
				sB = p.substr(0, p.length - sB.length) + sB;
				
				// a has nB and b has nA on purpose for desc numerical and asc name
				var a = (sA + nB).toLowerCase();
				var b = (sB + nA).toLowerCase();
				
				return (b < a) ? -1 : (b > a) ? 1 : 0;
				
			}
		).appendTo('.leaderboard');
		
	});
	
	// look for new clicks to send every second	
	setInterval(sendClick, 1000);
	
});