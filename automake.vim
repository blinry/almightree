set updatetime=1000
autocmd CursorMoved,CursorMovedI,CursorHold,CursorHoldI *
            \ silent w |
            \ silent execute "!make &> /tmp/makeerrors &" |
            "\ redraw! |
            \ cgetfile /tmp/makeerrors
