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
      var rolls = 0;
      var rollHistory = [];
      var rollHistogram = {};
      var updateBoard = function(die){
	  rollHistory.push(die);
	  rollDisplay.text(rollHistory.length);
	  rollHistogram[die]++;
	  lastRoll.text(die);
	  $('button').each(function(idx, elem){
			       var btn = $(elem);
			       var roll = parseInt(btn.data('roll'));
			       var ev = rollHistory.length * probs[roll];
			       console.log(roll, probs[roll], ev, rollHistory.length);
			       
			       $('.ev', elem).text(ev.toString().substring(0,5));
			   });
      };
      for(var i =2; i<=12; i++){
	  rollHistogram[i] = 0; //initialize the histogram
	  var btn = $('<button>');
	  btn.append($("<strong>").append(i));
	  btn.append($('<br>'));
	  btn.append($("<span>").addClass("count").append("0"));
	  btn.append($("<span>").addClass("ev").append("0"));
	  btn.data('roll', i);
	  btn.click(function(){
			var cnt = parseInt($('.count', this).text());
			$('.count', this).text(cnt+1);
			updateBoard($(this).data('roll'));
		    });
	  nums.append(btn);
      }
  });
