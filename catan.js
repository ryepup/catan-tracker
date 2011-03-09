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

      var loadState = function(){
	  try{
	      if(localStorage.rollHistory){
		  rollHistory = $.parseJSON(localStorage.rollHistory);
		  console.log('Loaded ', localStorage.rollHistory);
	      }
	      if(localStorage.rollHistogram){
		  rollHistogram = $.parseJSON(localStorage.rollHistogram);
		  console.log('Loaded ', localStorage.rollHistogram);
	      }
	 
	  } catch (x) { }
	  rolls = rollHistory.length;	  
	  updateEVs();
      };

      var updateEVs = function(){
	  $('button.dice').each(function(idx, elem){
				    var btn = $(elem);
				    var roll = parseInt(btn.data('roll'));
				    var ev = rollHistory.length * probs[roll];
				    $('.ev', btn).text(ev.toString().substring(0,5));
				    $('.count', btn).text(rollHistogram[roll]);
				    var diff = rollHistogram[roll] - ev;
				    //console.log(rollHistogram[roll], ev, diff);
				    if(Math.abs(diff) < 1){
					btn.css('background-color', "rgb(182, 167, 146)");
				    }else if (diff < -2) {
					btn.css('background-color', "rgb(182, 167, 186)");
				    }
				    else if (diff < -4){
				    	btn.css('background-color', "rgb(182, 167, 226)");
				    }
				    else if (diff < -6){
				    	btn.css('background-color', "rgb(182, 167, 255)");
				    }
				    else if (diff > 6){
				    	btn.css('background-color', "rgb(255, 167, 146)");
				    }
				    else if (diff > 4){
				    	btn.css('background-color', "rgb(222, 167, 146)");
				    }
				    else if (diff > 2) {
					btn.css('background-color', "rgb(202, 167, 146)");
				    }


				    
			   });
	  lastRoll.text(rollHistory[rollHistory.length-1]);
	  rollDisplay.text(rollHistory.length);	  
      };

      var undoInterval = null;
      var updateBoard = function(die){
	  rollHistory.push(die);
	  rollHistogram[die]++;
	  updateEVs();
	  var undoSecs = 5;
	  var undobtn = $('#undo');
	  undobtn.attr('disabled', null).text('Undo (' + undoSecs + ')');
	  clearInterval(undoInterval);
	  undoInterval = setInterval(function(){
					 undoSecs--;
					 undobtn.text('Undo (' + undoSecs + ')');
					 if(undoSecs == 0){
					     localStorage.rollHistory = $.toJSON(rollHistory);
					     localStorage.rollHistogram = $.toJSON(rollHistogram);
					     console.log('Saved');
					     clearInterval(undoInterval);
					     undobtn.text('Undo').attr('disabled', true);
					 }
				     }, 1000);
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
			   clearInterval(undoInterval);
			   loadState();
			   $(this).attr('disabled', 'true').text('Undo');
		       });
      loadState();
  });
