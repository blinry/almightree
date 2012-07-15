default:
	sed 's/\(^[ ]*\)/\1- /' from > to
	markdown -o to.md to
	cat header.html to.md footer.html > index.html
