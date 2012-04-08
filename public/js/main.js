require(
	[ 'require'
	, 'jquery'
	, '/js/bootstrap.min.js' ]
	, function (require, $) {
		$(function () {

			//Attach autofit
			$('.autofit')
				.change(autofit)
				.keydown(autofit)
				.keyup(autofit)
				.each(function (i, elem) {
					autofit.apply(elem, null);
				});

			$("textarea.accept-tab").keydown(function(e) {
				if(e.keyCode === 9) { // tab was pressed
					// get caret position/selection
					var start = this.selectionStart;
					end = this.selectionEnd;

					var $this = $(this);

					// set textarea value to: text before caret + tab + text after caret
					$this.val($this.val().substring(0, start)
						+ "\t"
						+ $this.val().substring(end));

					// put caret at right position again
					this.selectionStart = this.selectionEnd = start + 1;

					// prevent the focus lose
					return false;
				}
			});

		});

		function autofit() {
			var text = $(this).val().replace(/\n/g, '<br/>');
			var copy = $(this).siblings('.autofit-copy');
			if (copy.length > 0)
				copy.html(text);
		}
	}
);
