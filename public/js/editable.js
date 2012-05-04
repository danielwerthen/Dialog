define(['jquery'], function ($) {
	$.fn.editable = function () {
		return this.each(function () {
		console.log('test');
			var div = this;
			$(this).keydown(function (e) {
				if (e.keyCode == 13) return false;
			});
			$(this).focus(function () {
				window.setTimeout(function () {
					var sel, range;
					if (window.getSelection && document.createRange) {
						range = document.createRange();
						range.selectNodeContents(div);
						sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					} else if (document.body.createTextRange) {
						range = document.body.createTextRange();
						range.moveToElementText(div);
						range.select();
					}
				}, 1);
			});
		});
	};
	$(function () {
		$('.editable').editable();
	});
});
