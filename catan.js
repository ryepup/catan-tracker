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
    
      try{
	  rollHistory = $.parseJSON(localStorage.rollHistory) || [];
	  rollHistogram = $.parseJSON(localStorage.rollHistogram) || {};    
      } catch (x) { }

      var rolls = rollHistory.length;

      var updateEVs = function(){
	  $('button').each(function(idx, elem){
			       var btn = $(elem);
			       var roll = parseInt(btn.data('roll'));
			       var ev = rollHistory.length * probs[roll];
			       console.log(roll, probs[roll], ev, rollHistory.length);
			       $('.ev', btn).text(ev.toString().substring(0,5));
			   });

	  
      };
      var updateStats = function(){
	  lastRoll.text(rollHistory[rollHistory.length-1]);
	  rollDisplay.text(rollHistory.length);	  
      };
      var updateBoard = function(die){
	  rollHistory.push(die);
	  rollHistogram[die]++;
	  updateStats();
	  updateEVs();
	  localStorage.rollHistory = $.toJSON(rollHistory);
	  localStorage.rollHistogram = $.toJSON(rollHistogram);
      };
      for(var i =2; i<=12; i++){
	  if(rollHistogram[i] === undefined)
	      rollHistogram[i] = 0; //initialize the histogram
	  var btn = $('<button>');
	  btn.append($("<strong>").append(i));
	  btn.append($('<br>'));
	  btn.append($("<span>").addClass("count").append(rollHistogram[i]));
	  btn.append($("<span>").addClass("ev").append("0"));
	  btn.data('roll', i);
	  btn.click(function(){
			var cnt = parseInt($('.count', this).text());
			$('.count', this).text(cnt+1);
			updateBoard($(this).data('roll'));
		    });
	  nums.append(btn);
      }
      updateEVs();
      updateStats();
      $('#new-game').click(function(){
			      if(confirm('Start new game?')){
				  delete localStorage.rollHistory;
				  delete localStorage.rollHistogram;
				  document.location = ".";
			      } 
			   });
  });
