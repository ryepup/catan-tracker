$(function(){
      var nums = $('#numbers');
      var rolls = 0;
      for(var i =1; i<=12; i++){
	  var btn = $('<button>');
	  btn.append($("<strong>").append(i));
	  btn.append($("<div>").addClass("count").append("0"));
	  btn.click(function(){
			rolls += 1;
			var cnt = parseInt($('.count', this).text());
			$('.count', this).text(cnt+1);
		    });
	  nums.append(btn);
      }
  });
