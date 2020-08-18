// ==UserScript==
// @name        Sosed TV
// @namespace   https://sosed.tv/*
// @description Sosed TV
// @include     https://sosed.tv/*
// @version     4.0
// @grant       none
// ==/UserScript==

var banned = {}, bannedNames

window.setInterval
(
	function ()
	{
		Array.prototype.slice.call (document.getElementsByClassName ('chat__message')).forEach
		(
			function (i)
			{
				i.onclick = function (e)
				{
					if (e.ctrlKey)
					{
						banned [this.getAttribute ('data-from')] = this.firstElementChild.getAttribute ('data-name')
						
						bannedNames = Object.values (banned).filter (i => i).sort ((a, b) => a.localeCompare (b))
						
						console.log (bannedNames.join (', ') + ' попущен' + (bannedNames.length > 1 ? 'ы' : ''))
					}
					
					if (e.altKey)
					{
						var dataFrom = this.getAttribute ('data-from'), site, account, url
						
						if (dataFrom && dataFrom.split (':').length == 2)
						{
							site = dataFrom.split (':') [0]
							account = dataFrom.split (':') [1]
							
							if (site == 'vkontakte')
								url = 'https://vk.com/id'
							else if (site == 'facebook')
								url = 'https://www.facebook.com/profile.php?id='
							else if (site == 'google')
								url = 'https://www.google.com/maps/contrib/'
								
							url += account
						}
						
						window.open (url)
					}
				}
			}
		)
		
		Object.keys (banned).forEach
		(
			function (i)
			{
				Array.prototype.slice.call (document.querySelectorAll ('[data-from="' + i + '"]')).forEach (i => i.remove ())
			}
		)
	}, 
	500
)

window.addEventListener
(
	'keydown', 
	function (e)
	{
		if (e.altKey && e.keyCode == 67)
		{
			['header', 'main-video', 'tabs', 'rooms', 'users', 'popups hidden'].forEach
			(
				i => document.getElementsByClassName (i).length && document.getElementsByClassName (i) [0].remove ()
			)
			
			document.getElementsByName ('ym-native-frame').length && document.getElementsByName ('ym-native-frame') [0].remove ()
			
			document.getElementsByClassName ('tabs__content').length && (document.getElementsByClassName ('tabs__content') [0].style.width = '600px')
		}
	}, 
	false
)
