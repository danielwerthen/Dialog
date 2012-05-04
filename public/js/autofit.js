define(['jquery'], function ($) {
	$.fn.autofit = function () {
		return this.each(function(){
			// Variables
			var colsDefault = this.cols;
			var rowsDefault = this.rows;
			
			//Functions
			var grow = function() {
				growByRef(this);
			}
			
			var growByRef = function(obj) {
				var linesCount = 0;
				var lines = obj.value.split('\n');
				
				for (var i=lines.length-1; i>=0; --i)
				{
					linesCount += Math.floor((lines[i].length / colsDefault) + 1);
				}

				if (linesCount >= rowsDefault)
					obj.rows = linesCount;
				else
					obj.rows = rowsDefault;
			}
			
			// Manipulations
			this.onkeyup = grow;
			this.onfocus = grow;
			this.onblur = grow;
			growByRef(this);
		});
	};

	//Attach plugin
	$(function () {
		$('.autofit').autofit();
	});
});
