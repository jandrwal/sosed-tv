// ==UserScript==
// @name        Sosed TV
// @namespace   https://sosed.tv/*
// @description Sosed TV
// @author      Hans Holzfäller
// @include     https://sosed.tv/*
// @include     https://sosedki.tv/*
// @version     5.9
// @grant       none
// ==/UserScript==

var banned = {}, bannedNames

var userNames = ['Test String']

window.setInterval
(
	function ()
	{
		[...document.getElementsByClassName ('chat__message')].forEach
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
							{
								url = 'https://vk.com/id' + account
							}
							else if (site == 'facebook')
							{
								url = 'https://graph.facebook.com/' + account + '/picture'
							}
							else if (site == 'google')
							{
								url = 'https://www.google.com/maps/contrib/' + account
							}
							
							site == 'facebook' ? openFacebookPic (url) : window.open (url)
						}
					}
				}
				
				var messageNew = i.getElementsByClassName ('chat__text') [0]
				
				messageNew.innerHTML = messageNew.innerHTML.replace (/<\/?span.*?>/g, '')
				
				userNames.forEach (j => messageNew.innerHTML = messageNew.innerHTML.replace (new RegExp (j, 'ig'), k => '<span class="chat__reply-to">' + k + '</span>'))
			}
		)
		
		Object.keys (banned).forEach
		(
			function (i)
			{
				[...document.querySelectorAll ('[data-from="' + i + '"]')].forEach (i => i.remove ())
			}
		)
	}, 
	100
)

function openFacebookPic (url)
{
	if (window.chrome)
	{
		var tab = window.open ()
		
		tab.document.write ('<img src="' + url + '"/>')
	}
	else
	{
		var req = new XMLHttpRequest ()
		var reader = new FileReader ()
		
		req.open ('GET', url, true)
		req.responseType = 'blob'
		
		req.onreadystatechange = function ()
		{
			if (req.readyState == 4)
			{
				var blob = req.response
				
				reader.readAsDataURL (blob)
				
				reader.onloadend = i => window.open (reader.result)
			}
		}
		
		req.send (null)
	}
}

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

function notify ()
{
	var titleOld = document.title, titleNew, interval
	var messagesOld, messagesCurrent, messagesNew, usersNew, messagesCount = 0, messagesCountNew
	
	window.addEventListener
	(
		'blur', 
		function (e)
		{
			messagesOld = getCurrentMessages ()
			
			window.setInterval
			(
				function ()
				{
					messagesCurrent = getCurrentMessages ()
					messagesNew = messagesCurrent.filter (i => messagesOld.indexOf (i) == -1)
					messagesOld = messagesCurrent

					messagesNew = messagesNew.map (i => document.querySelector ('[data-msgid="' + i + '"]'))

					usersNew = messagesNew.map (i => i.innerHTML.match (/data-name="(.*?)"/) [1])
					messagesNew = messagesNew.map (i => i.getElementsByClassName ('chat__text') [0].innerHTML.replace (/\r|\n/g, '').trim ())

					messagesCountNew = 0

					for (var i = 0; i < messagesNew.length; i++)
					{
						var messageNew = messagesNew [i]
						var userNew = usersNew [i]

						var match = userNames.reduce ((n, i) => n || (messageNew.match (new RegExp (i, 'ig')) ? 1 : 0), 0)

						if (match)
						{
							console.log ('<' + userNew + '>: ' + messageNew.replace (/<[^<>]*>/g, ''))

							messagesCountNew++
						}
					}

					messagesCount += messagesCountNew

					if (messagesCountNew)
					{
						clearInterval (interval)

						titleNew = '(' + messagesCount + ') ' + titleOld

						interval = setInterval (() => (document.title = document.title == titleOld ? titleNew : titleOld), 500)
					}
				},
				5000
			)
		}, 
		false
	)
	
	window.addEventListener
	(
		'focus', 
		function (e)
		{
			document.title = titleOld
			messagesCount = 0; messagesCountNew = 0
			clearInterval (interval)
		}, 
		false
	)
	
	function getCurrentMessages ()
	{
		return [...document.getElementsByClassName ('chat__message')].map (i => i.getAttribute ('data-msgid')).filter (i => i != 'system')
	}
}

document.onreadystatechange = function () {if (document.readyState == 'complete') notify ()}
