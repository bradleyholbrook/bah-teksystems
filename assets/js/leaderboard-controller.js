var clicks = {};
var updatePlayerScores;

function pollPlayers()
{
	
	// get selected record for select persistance
	var selected = $(".leaderboard .selected .name").text();
	
	// make a request for the remote values for syncronization
	updatePlayerScores = $.ajax('/index.php/player/index/'+selected).done( function(response)
		{
			// don't overwrite the html if a click is in process.
			if(getClicksLength() > 0) return;
			
			// display the results
			$(".leaderboard").html(response);
			
			// assign click action to new html div's.
			$(".leaderboard .player").click( function(e)
				{
					// don't let incoming selected row override new selected row
					updatePlayerScores.abort();
					
					// handle selected item
					$(".leaderboard .player").each( function(){ $(this).removeClass('selected'); });
					$(this).addClass('selected');
					
					// set details name
					$(".details .name").text( $(".selected .name").text() );
					
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
* returns the length of the clicks object
* 
*/
function getClicksLength()
{
	var count = 0; var i;
	for (i in clicks) if (clicks.hasOwnProperty(i)) count++;
	return count;
}

/**
* jQuery ajax was only sending every 500ms, this bundles the clicks in an array and sends a group of clicks
* at one time.
* 
*/
function sendClick()
{
	if(getClicksLength() > 0)
	{
		// copy clicks and reset to blank to take in next group
		var toSend = clicks;
		clicks = {};
		
		// loop click groups, send ajax
		for (i in toSend)
		{
			if (toSend.hasOwnProperty(i))
			{
				$.ajax('/index.php/player/score/'+toSend[i].key+'/'+toSend[i].clicks).done(function(){ clicked = false; });
			}
		}
		
	}
}

/**
* 
*/
function addPoints(name)
{
	var found = false;
	for(var k in clicks)
	{
		if(clicks.hasOwnProperty(name))
		{
			found = true;
			var click = clicks[name];
			clicks[name].clicks -= -1;
		}
	}
	
	if(!found)
	{
		var click = {
			key: name,
			clicks: 1
		}
		clicks[click.key] = click;
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
	$(".inc").fastClick(function()
		{
			// don't let incoming remote data display while a click is in progress
			// we'll get the correct number in the end and avoid a yo-yo effect
			// in the number display
			updatePlayerScores.abort();
			addPoints($(".selected .name").text());
			
			$(".selected .score").html( ($(".selected .score").html() - -5) );
			
			$('div.player').sort( function(a,b)
				{
					var p = "0000000";
					var sA = $(a).find('.score').text();
					var sB = $(b).find('.score').text();
					
					// zero fill number to exactly 7 charachters for alphanumeric sort, not numeric sort
					sA = p.substr(0, p.length - sA.length) + sA;
					sB = p.substr(0, p.length - sB.length) + sB;
					
					// a has $(b) and b has $(a) on purpose for sort:
					// desc numerical and asc name
					var a = (sA + $(b).find('.name').text()).toLowerCase();
					var b = (sB + $(a).find('.name').text()).toLowerCase();
					
					return (b < a) ? -1 : (b > a) ? 1 : 0;
					
				}
			).appendTo('.leaderboard');
		
		}
	);
	
	// look for new clicks to send every second	
	setInterval(sendClick, 1000);
	
});