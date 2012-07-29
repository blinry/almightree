index.html: to.md header.html footer.html
	cat header.html to.md footer.html > index.html
to: from
	echo "morr.cc" > to
	cat from | sed 's/^/    /' >> to
	sed -i 's/\(^[ ]*\)\([^ ].*\)/\1<span class="node"><span class="zoom">+<\/span> <span class="text">\2<\/span><\/span>/' to
	sed -i 's/\(^[ ]*\)/\1- /' to
to.md: to
	markdown -o to.md to
