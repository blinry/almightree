index.html: to.html header.html footer.html
	cat header.html to.html footer.html > index.html
to: from
	cp from to
	sed -i 's/\(^[ ]*\)\([^ ].*\)/\1<span class="node">\2<\/span>/' to
	sed -i 's/\(^[ ]*\)/\1- /' to
to.html: to
	markdown to > to.html
