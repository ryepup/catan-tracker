$(function(){
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
      };
      for(var i =1; i<=12; i++){
	  rollHistogram[i] = 0; //initialize the histogram
	  var btn = $('<button>');
	  btn.append($("<strong>").append(i));
	  btn.append($("<div>").addClass("count").append("0"));
	  btn.data('roll', i);
	  btn.click(function(){
			var cnt = parseInt($('.count', this).text());
			$('.count', this).text(cnt+1);
			updateBoard($(this).data('roll'));
		    });
	  nums.append(btn);
      }
  });
