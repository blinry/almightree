set updatetime=10
autocmd CursorMoved,CursorMovedI,CursorHold,CursorHoldI *
            \ w |
            \ silent execute ":!make &> /tmp/makeerrors &" |
            "\ redraw! |
            \ cgetfile /tmp/makeerrors
