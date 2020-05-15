function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
window.onpopstate = function (event) {
    console.log(document.location);
    console.log(document.location.pathname);

    list_load(document.location.pathname.replace("/polls/", ""));
};
function load(url) {
    list_load(url);
    history.pushState("", "", "/polls/" + url);
}
function list_load(url) {
    data = {"offset":"0","limit":"100"};
    fetch("http://127.0.0.1:8000/polls/" + url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "X-CSRFToken": getCookie('csrftoken'),
        }

    }

    )
        .then(response => {
            response.text().then(function (text) {
                console.log(url);

                document.querySelector(".container").innerHTML = text;

            });
        });

}