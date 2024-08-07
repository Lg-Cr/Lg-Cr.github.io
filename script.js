function changeheader(id, id2, id3) {
    var element = document.getElementById(id);
    var element2 = document.getElementById(id2);
    var element3 = document.getElementById(id3);
    if (element.style.height == '200px') {
        element.style.height = '50px';
        element2.style.padding = '50px 0px 0px 50px';
        element3.style.display = 'none';
    } else {
        element.style.height = '200px';
        element2.style.padding = '200px 0px 0px 50px';
        element3.style.display = 'block';
    }
}
