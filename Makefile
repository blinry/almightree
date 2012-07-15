index.html: to.md header.html footer.html
	cat header.html to.md footer.html > index.html
to: from
	sed 's/\(^[ ]*\)/\1- /' from > to
to.md: to
	markdown -o to.md to
