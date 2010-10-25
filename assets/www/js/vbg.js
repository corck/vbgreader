function initList() {
    $('#ajax-loader').hide();
    $('.entry').delegate("a", "click", function(e){
        e.preventDefault; // prevent default link behaviour
        id = this.id.replace(/feed-entry-/, ''); // get id
        localStorage.setItem("feed-entry", id); // set storage
        jQT.goTo('#article','slide');
    });
}



