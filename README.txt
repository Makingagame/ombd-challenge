Hi, thanks for reading me!

This is a movie-finder application developed as a technical challenge. It interacts with the public OMDb API to query movie data.

----------------------------------------
	Functional Considerations
----------------------------------------

* The user can search a movie by entering something into the search box. 
* Additionally, they can select the year range and movie type of the movie they want to see.
* If searching for episodes, they can select which season of episodes they wish to search for.

When the movies are searched they will display in a list on the left hand side of the screen.
Once the movies have been searched the user may: 
* Select a movie on the left hand side of the screen to display more details of it on the right hand side of the screen.
* From this detailed view, the user can click the "Watchlist" button to add the movie data to local storage.
* There is a link in the header which navigates to the watchlist.

----------------------------------------
	Technical Considerations
----------------------------------------


1. 	Just a few quick technical considerations: 
		* This movie app was only designed to display correctly on Chrome/Edge. 
		* Node 12 and some jQuery was used in it's creation.


2.	In the 'documentation' folder of this project you can find:
		* Next Issues to Work On.txt: Covers the defects/potential improvements that I am aware of and will work on in the future.

		* OMDb API Choices Made.txt: This document covers major decisions made during design/building/testing.


3.	I tried my best to make the application as close to the challenge's wireframe screencap as possible, but I had to add some things for functionality:
		* Season Text Box: You cannot search for episodes without inputting a Season number, I wanted the user to have control over which Season they search for.
		* Watchlist Link/Header: Adding a header with a link to the Watchlist page seemed like the most natural way for users to find it.


4. 	Some details of movies have changed since the original wireframe screencap was taken: 
		* Tomatometer is no longer supported by OMDB Api.
		* Details for Star wars movies have changed (movie titles, plot details, listed actors, etc.).


5. 	In the documentation folder I have included a screencap of how the application displays on my screen. It may appear different on smaller/larger screens and I have not been able to test it thoroughly.