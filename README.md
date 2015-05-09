# viddy
viddy


Features:
	P0:
		-animation when loading videos at the beginning
		-tutorial
		-if video not found in the queue list simply add the video to the front of the list
		-branding with a logo on the top left?
		-some kind of way to show that there is no videos on the channel
		-click on the channel name and jump to that channel

		-change channels (subreddits) [figure out how to get videos from reddit with the same domain name rather than iterating through]
		-search for channels
		-save the subreddit people requested and cache videos from there
		
	P1:
		-search for videos
		-show video thumbnail on facebook (probably need to switch to jade)
		-iOS / android support
		-more buttons:
			toggle comments + (comment on the video?) + search + like (save the video) + share button + user (login/log out/user info) + contact trendeo + filter videos + skip video segments + home button
		-show comments as a slider (enable/disable with c)
		-saving videos the user watched and skipping the videos if he watched fully / skipped

	P2:
		-show how popular the video is
		-search for users
		-user defined channels?
		-link to reddit?
		-getting the data of skips + skipping to the video if the skipping is enabled by the user
		-switch to database (to store videos potentially forever..orr no point right now)
		-voice command

	Scrap ideas:	
		-user playlists
		-follow users

How:
	add to database:
		videoId, popularity, date entered, date last

	on channel switch:
		request videos, load videos, etc (same as first load)



Bugs:
	-returning null queue bug
	-title carries over if animation is not done
	-disable load with mini skips (load with miniskips lags because it tries to load)
	-make arrows unclickable when they are transparent
	-





