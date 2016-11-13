$(document).ready(function() {
     // Set
	var apibaseurl = 'http://localhost:80';
	var games = [];
     // Request
	var request = $.ajax({
	  url: apibaseurl + '/gamescores-server/api/games',
	}).done(function(data) {
		games = data;
          var promises = [];

		$.each(data, function(index, game) {
               // Because the HTML should not be generated until all games and respective score have been fetched
               var deferred = $.Deferred();
			$.ajax({
				url: apibaseurl + '/gamescores-server/api/scores/' + game.game_id + '/5'
			}).done(function(data){
				games[index].scores = data;
                    deferred.resolve();
			});
               promises.push(deferred);
		});
          // When all the data has been received, create markup
          $.when.apply($, promises).then(function(){
               if(games.length > 0) {
                    $(".no-games.alert").hide();
                    $.each(games, function(index, game) {
                         $("#games-list").append(
                              '<div id="game-' + game.game_id + '" class="game panel panel-info"><!-- Start game panel --> ' +
                         '<div class="panel-heading">' +
                         '    <h2 class="text-info panel-title">' + game.title + '</h2></div>' +
                         '<div class="panel-body">' +
                         '    <div class="row">' +
                         '        <div class="col-md-8">' +
                         '            <p>' + game.description + '</p>' +
                         '            <p>Updated on: ' + game.update_timestamp + '</p>' +
                         '        </div>' +
                         '        <div class="col-md-4">' +
                         '            <div class="panel panel-success">' +
                         '                <div class="panel-heading">' +
                         '                    <h3 class="panel-title"><i class="fa fa-trophy heading-icon"></i><span>Ranking - Top 5 </span> </h3></div>' +
                         '                <div class="panel-body">' +
                         '                    <div class="table-responsive">' +
                         '                        <table class="game-scores table">' +
                         '                            <thead>' +
                         '                               <tr>' +
                         '                                    <th>Score </th>' +
                         '                                    <th>Player </th>' +
                         '                                    <th>Date </th>' +
                         '                               </tr>' +
                         '                            </thead>' +
                         '                            <tbody>' +
                         '                            </tbody>' +
                         '                        </table>' +
                         '                    </div>' +
                         '                </div>' +
                         '            </div>' +
                         '        </div>' +
                         '    </div>' +
                         '</div>' +
                     '</div><!-- End game panel -->'
                         );
                         $.each(game.scores, function(index, score) {
                              $('.game#game-' + game.game_id + " .game-scores.table tbody").append(
                              '    <tr class="score-record">' +
                         '              <td>' + score.player_name + '</td>' +
                         '              <td>' + score.value + '</td>' +
                         '              <td>' + score.post_timestamp + '</td>' +
                         '         </tr>'
                              );
                         })
                    });
               }
          });
	});
});