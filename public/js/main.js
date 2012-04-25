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

			$('.overlay-close').click(function () {
				$(this).parents('.overlay').removeClass('opened');
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

			var reactionInputs = $('input.reaction');
			reactionInputs.keydown(function (e) {
				if (e.keyCode === 32)
					return false;
			});

			reactionInputs.change(function (elem) {
				var field = $(this)
					, reaction = field.val()
					, reactions = field.parent('.reactions')
					, id = reactions.data('id')
					, unique = true
				if (reaction.length > 0)
					reaction = reaction.substr(0,1).toUpperCase() + reaction.substr(1);
				reactions.find('.reaction').each(function (i, ele) {
					var self = $(ele);
					if (self.html().toLowerCase() === reaction.toLowerCase()) {
						unique = false;
						if (!self.hasClass('clicked')) {
							self.attr('data-amount', self.attr('data-amount') - (-1));
							self.addClass('clicked');
							vote(reaction, id, self);
						}
					}
				});
				if (unique) {
					field.before($('<div class="reaction clicked" data-amount=1>' + reaction + '</div>'));
					vote(reaction, id, field);
				}
				field.val('');
			});

			$('.reaction').click(function () {
				var self = $(this)
				if (self.hasClass('clicked'))
					return;
				vote(self.html(), self.parent('.reactions').data('id'), self);
				self.addClass('clicked');
				self.attr('data-amount', self.attr('data-amount') - (-1));
			});

			function vote(reaction, id, element) {
				if (!reaction || !id)
					return;
				var h = element.parents('.reactions-block').children('.reactions-header')
				h.attr('data-amount', h.attr('data-amount') - (-1));
				$.ajax({
					type: 'POST',
					url: '/vote/' + id,
					data: { reaction: reaction }
				});
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
				data.append(makeHidden('character0', meInput.val()));
				data.append(makeHidden('character1', youInput.val()));
				$('.convo .retort').each(function (i, element) {
					var retort = $(element)
						, me = retort.hasClass('me');
					data.append(makeHidden('retorters[' + i + ']', (me ? '0' : '1')));
					data.append(makeHidden('retorts[' + i + ']', retort.find('p').html()));
				});
				//form.submit();
				$.post(form.attr('action'), form.serialize(), function (data) {
					form.find('.validation.failed').removeClass('failed');
					if (data.error) {
						for (var err in data.error.errors) {
							var field = form.find('#' + err)
							field.addClass('failed');
							field.on('keydown.removeValidation', function () {
								$(this).removeClass('failed');
								$(this).off('keydown.removeValidation');
							});
						}
					}
					else {
						window.location = '/';
					}
				});
			});

			function displayErrors(form, errors) {
			}

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
