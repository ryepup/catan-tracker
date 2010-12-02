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
	      rollHistory = $.parseJSON(localStorage.rollHistory) || [];
	      rollHistogram = $.parseJSON(localStorage.rollHistogram) || {};    
	  } catch (x) { }
	  rolls = rollHistory.length;	  
	  updateEVs();
      };

      var updateEVs = function(){
	  $('button').each(function(idx, elem){
			       var btn = $(elem);
			       var roll = parseInt(btn.data('roll'));
			       var ev = rollHistory.length * probs[roll];
			       $('.ev', btn).text(ev.toString().substring(0,5));
			       $('.count', btn).text(rollHistogram[roll]);
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
					     undobtn.text('Undo');
					 }
				     }, 1000);
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
			updateBoard($(this).data('roll'));
		    });
	  nums.append(btn);
      }
      $('#new-game').click(function(){
			      if(confirm('Start new game?')){
				  delete localStorage.rollHistory;
				  delete localStorage.rollHistogram;
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
