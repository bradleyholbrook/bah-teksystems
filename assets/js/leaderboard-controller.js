var clicks = [];
var updatePlayerScores;

function pollPlayers()
{
	
	// get selected record for select persistance
	var selected = $(".leaderboard .selected .name").text();
	
	updatePlayerScores = $.post('/index.php/player/index/'+selected).done( function(response)
		{
			// don't overwrite the html if a click is in process.
			if(clicks.length > 0) return;
			
			// display the results
			$(".leaderboard").html(response);
			
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

function sendClick()
{
	if(clicks.length > 0)
	{
		console.log(clicks);
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
	
	$(".inc").fastClick(function(){
		
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
		
	setInterval(sendClick, 1000);
	
});