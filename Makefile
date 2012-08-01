index.html: to.html header.html footer.html
	cat header.html to.html footer.html > index.html
to: from
	echo "morr.cc" > to
	cat from | sed 's/^/    /' >> to
	sed -i 's/\(^[ ]*\)\([^ ].*\)/\1<span class="node"><span class="zoom"><\/span> <span class="text">\2<\/span><\/span>/' to
	sed -i 's/\(^[ ]*\)/\1- /' to
to.html: to
	markdown -o to.html to
