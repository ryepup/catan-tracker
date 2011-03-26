$(function(){
      var probs = {
	  2:.0277,
	  3:.0555,
	  4:.0833,
	  5:.1111,
	  6:.1388,
	  7:.1666,
	  8:.1388,
	  9:.1111,
	  10:.0833,
	  11:.0555,
	  12:.0277
      };
      var nums = $('#numbers');
      var rollDisplay = $('#rolls');
      var lastRoll = $('#last-roll');


      var rollHistory = [];
      var rollHistogram = {};
      var rolls = 0;
      var undoHistory = [];

      var loadState = function(){
	  try{
	      if(localStorage.rollHistory){
		  rollHistory = $.parseJSON(localStorage.rollHistory);
	      }
	      if(localStorage.rollHistogram){
		  rollHistogram = $.parseJSON(localStorage.rollHistogram);
	      }
	 
	  } catch (x) { }
	  rolls = rollHistory.length;	  
	  updateEVs();
      };

      var lerp = function(v, lower, upper){
	return lower + v*(upper-lower);
      };

      var updateEVs = function(){
	  $('button.dice').each(function(idx, elem){
				    var btn = $(elem);
				    var roll = parseInt(btn.data('roll'));
				    var ev = rollHistory.length * probs[roll];
				    $('.ev', btn).text(ev.toString().substring(0,4));
				    $('.count', btn).text(rollHistogram[roll]);
				    var diff = rollHistogram[roll] - ev;
				    if(Math.abs(diff) < 1){
					btn.css('background-color', "rgb(182, 167, 146)");
				    }else if (diff < 0) {
					var blue = Math.round(lerp(diff/-6, 146, 255));
					btn.css('background-color', "rgb(182, 167, "+ blue +")");
				    }else{
					var red = Math.round(lerp(diff/6, 182, 255));
					btn.css('background-color', "rgb(" + red + ", 167, 146)");
				    }
			   });
	  lastRoll.text(rollHistory[rollHistory.length-1]);
	  rollDisplay.text(rollHistory.length);	  
      };

      var updateBoard = function(die){
	  undoHistory.push({			       
			       rollHistory: $.toJSON(rollHistory),
			       rollHistogram: $.toJSON(rollHistogram)
			   });
	  $('#undo').attr('disabled', null);

	  rollHistory.push(die);
	  rollHistogram[die]++;
	  updateEVs();

	  localStorage.rollHistory = $.toJSON(rollHistory);
	  localStorage.rollHistogram = $.toJSON(rollHistogram);
      };

      for(var i =2; i<=12; i++){
	  if(rollHistogram[i] === undefined)
	      rollHistogram[i] = 0; //initialize the histogram
	  var btn = $('<button>');
	  btn.addClass('dice');
	  btn.append($("<strong>").append(i));
	  btn.append($('<br>'));
	  btn.append($("<span>").addClass("count").append(rollHistogram[i]));
	  btn.append($("<span>").addClass("ev").append("0"));
	  btn.data('roll', i);
	  btn.click(function(){
			var cnt = parseInt($('.count', this).text());
			updateBoard($(this).data('roll'));
			$(this).effect('pulsate');
		    });
	  nums.append(btn);
      }
      $('#new-game').click(function(){
			      if(confirm('Start new game?')){
				  localStorage.rollHistory = $.toJSON([]);
				  for(var i =2; i<=12; i++){
				      rollHistogram[i] = 0;
				  }
				  localStorage.rollHistogram = $.toJSON(rollHistogram);
				  document.location = ".";
			      } 
			   });
      $('#undo').click(function(){
			   var hist = undoHistory.pop();
			   localStorage.rollHistory = hist.rollHistory;
			   localStorage.rollHistogram = hist.rollHistogram;
			   loadState();
			   if (undoHistory.length == 0){
			       $(this).attr('disabled', 'true');			       
			   }

		       });
      loadState();
  });
