index.html: to.md header.html footer.html
	cat header.html to.md footer.html > index.html
to: from
	cp from to
	sed -i 's/\(^[ ]*\)\([^ ].*\)/\1<span class="node">\2<\/span>/' to
	sed -i 's/\(^[ ]*\)/\1- /' to
to.md: to
	markdown -o to.md to
