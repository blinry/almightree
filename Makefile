index.html: to.html header.html footer.html
	cat header.html to.html footer.html > index.html
to: from
	cp from to
	sed -i 's/\(^[ ]*\)/\1- /' to
to.html: to
	markdown to > to.html
	sed -i '1s/ul/ul id="almightree"/' to.html
