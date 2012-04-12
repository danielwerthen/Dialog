require(
	[ 'require'
	, 'jquery'
	, '/js/autoGrowInput.js'
	, '/js/bootstrap.min.js' ]
	, function (require, $) {
		$(function () {

			var state = $('.state .inner')
				, me = state.hasClass('me')
				, convo = $('.convo')
				, shift = false
				, content = $('.content')
				, meInput = $('input.character-io.me')
				, youInput = $('input.character-io.you')
				, charIO = $('input.character-io')

			$('.retorter')
				.keydown(function (e) {
					if (e.keyCode === 13) {
						enter($(this), !e.shiftKey);
						return false;
					}
					if (e.keyCode === 9) {
						flip();
						return false;
					}
				});

			//Attach autofit
			$('.autofit')
				.change(autofit)
				.keydown(autofit)
				.keyup(autofit)
				.each(function (i, elem) {
					autofit.apply(elem, null);
				});

			function enter(textarea, _flip) {
				var _me = meInput.val(),
						_you = youInput.val(),
						text = textarea.val();
				if (text === '')
					return;
				convo.append($('<div class="' + (me ? 'me' : 'you') + ' retort"><span class="tag">' + (me ? _me : _you) + '</span>' + text + '</div>'));
				textarea.val('');
				content.scrollTop(content.prop('scrollHeight'));
				if (_flip)
					flip();
			}

			function syncChars() {
				var me = meInput.val(),
						you = youInput.val();
				$('.retort.me span.tag').html(me);
				$('.retort.you span.tag').html(you);
				setState();
			}

			function setState() {
				var _me = meInput.val(),
						_you = youInput.val();
				if (me) {
					state.html(_me);
				}
				else {
					state.html(_you);
				}
			}

			function flip() {
				me = !me;
				if (me) {
					state.removeClass('you');
					state.addClass('me');
				}
				else {
					state.removeClass('me');
					state.addClass('you');
				}
				setState();

			}

			charIO.autoGrowInput();
			charIO.keyup(function () {
				syncChars();
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
