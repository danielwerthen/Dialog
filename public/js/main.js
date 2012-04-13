require(
	[ 'require'
	, 'jquery'
	, '/js/autoGrowInput.js'
	, '/js/bootstrap.min.js' ]
	, function (require, $) {
		$(function () {

			$('.overlay-action').click(function () {
				var $link = $(this)
					, open = $link.data('open')
					, close = $link.data('close')
				if (open)
					$(open).addClass('opened')
				if (close)
					$(close).removeClass('opened')
			});

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
					if (e.keyCode === 9 && !e.shiftKey) {
						flip();
						return false;
					}
				});

			$('.action-link.switch-char').click(function () {
				flip();
				return false;
			});

			//Attach autofit
			$('.autofit')
				.change(autofit)
				.keydown(autofit)
				.keyup(autofit)
				.each(function (i, elem) {
					autofit.apply(elem, null);
				});

			function makeHidden(name, val) {
				return $('<input type="hidden" value="' + val + '" + name="' + name + '" />');
			}

			$('#submit-dialog').click(function () {
				var $link = $(this)
					, form = $link.parent('form')
					, data = null
				if (form.find('#data').length === 0)
					data = $('<div id="data" class="hidden"></div>').appendTo(form);
				else {
					data = form.find('#data');
					data.empty();
				}
				data.append(makeHidden('character-0', meInput.val()));
				data.append(makeHidden('character-1', youInput.val()));
				$('.convo .retort').each(function (i, element) {
					var retort = $(element)
						, me = retort.hasClass('me');
					data.append(makeHidden('retorter[' + i + ']', (me ? '0' : '1')));
					data.append(makeHidden('retort[' + i + ']', retort.find('p').html()));
				});
				form.submit();
			});

			function enter(textarea, _flip) {
				var _me = meInput.val(),
						_you = youInput.val(),
						text = textarea.val();
				if (text === '')
					return;
				convo.append($('<div class="' + (me ? 'me' : 'you') + ' retort"><span class="tag">' + (me ? _me : _you) + '</span>' + '<p>' + text + '</p>' + '</div>'));
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
