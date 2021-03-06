$(document).ready(function () {
    var products = JSON.parse(window.sessionStorage.getItem("queryResult"));
    var urlParams = new URLSearchParams(window.location.search);
    var product = {};
    if (products != null) {
        product = products.find(element => element.ProductId === urlParams.get("ProductId"));
    }
    if (products == null || product == null) {
        var Q = {
            query: { 'ProductId': urlParams.get("ProductId") }
        };
        $.get("/searchquery", $.param(Q), function (data) {
            product = data[0];
            setupProduct(product);
        });
    } else {
        //product = products.find(element => element.ProductId === urlParams.get("ProductId"));
        setupProduct(product);
    }
});


function getProductAvailability(status) {
    const caps_status = status.toUpperCase()
    if (caps_status === "YES") {
        return "Available"
    }
    return "Not Available"
}

const validFeatures = {
    "Cognitive-age": "Cognitive Age",
    "sound-off": "Audio can be turned off",
    "sound-loud": "Has loud sounds",
    "Moves": "Moves",
    "lights-off": "Lights can be turned off",
    "lights-bright": "Has bright/pulsating lights",
    "av-alt": "Has audio/visual output alternatives",
    "input-big": "Has large inputs", 
    "input-easy": "Has easy to press/manipulate inputs", 
    "touch-input": "Has touch input features", 
    "textured": "Has textural variation",
    "switch-acc": "Switch-accessible",
    "eye-acc": "Usable with eye-tracking device",
    "accessible by voice interface?": "Voice-activated",
    "xbox-adaptive-usable" : "Usable with Xbox Adaptive Controller"
}


function setupProduct(product) {
    /*product = {
        "_id": {
            "$oid": "5ec16e50cac0241e5c1d2374"
        },
        "ProductId": "1",
        "Name": "AAA Battery Interrupter",
        "Inventory": "LL-AD1001",
        "Image": "../img/tempImages/AAA Battery Interrupter.jpg",
        "Link": "https://drive.google.com/a/provail.org/file/d/1rHYeMLlbI37WcK4fUENUwM5SAJpctcvC/view?usp=sharing",
        "Type": "Adapter",
        "Availability": "Available",
        "Condition": "Fair",
        "Company": "Custom/Volunteer",
        "Notes": "This battery interrupter was custom made by a PROVAIL volunteer. It is used as a simple switch access solution for a toy (or other electronic device) that is battery operated and in an always on or always off state. This particular model is for devices that use a AAA sized battery. **$10.00 replacement cost.",
        "Cognitive-age": "any",
        "sound-off": "N/A",
        "sound-loud": "N/A",
        "Moves": "N/A",
        "lights-off": "N/A",
        "lights-bright": "N/A",
        "av-alt": "N/A",
        "input-big": "N/A",
        "input-easy": "N/A",
        "touch-input": "N/A",
        "textured": "N/A",
        "switch-acc": "Yes",
        "eye-acc": "N/A",
        "accessible by voice interface?": "N/A",
        "buyable": "Yes",
        "buy-link": "https://enablingdevices.com/product/battery-interrupters/",
        "borrowable": "Yes",
        "borrow-loc": "PROVAIL",
        "makable": "",
        "make-link": ""
    }*/

    // Menu Stuff
    $('#breadcrumb').append("<h2 tabindex='0'>" + product.Name + "</h2>")
    $('#breadcrumb').append("<a href='./categories.html' tabindex='0'>< Back to Search Results </a>")
    // $('#breadcrumb').append("<a class='active' href='./categories.html' tabindex='0'>" + product.Type + "</a>")

    // Photo stuff
    const img_prodImg = document.createElement('img')
    var imageLink = product.Image.substring(0, 6) === "../img" ? product.Image : product.EmbeddedLink;
    img_prodImg.setAttribute('src', imageLink)
    img_prodImg.setAttribute('alt', product.Name)
    img_prodImg.setAttribute('tabindex', '0')
    $('#image').append(img_prodImg)

    // How to Use This Item section
    var videoLink = product.Link;
    if (videoLink.indexOf("d/") != -1 && videoLink.indexOf("/view?") != -1) { // is a video
        var start = videoLink.indexOf("d/") + 2;
        var end = videoLink.indexOf("/view?");
        var fullEmbeddedLink = "https://drive.google.com/file/d/" + videoLink.substring(start, end) + "/preview";
        var htmlFrame = "<iframe src='" + fullEmbeddedLink + "' width='100%'></iframe>";
        $('#video').append(htmlFrame); 
    } else if (videoLink.indexOf("docs.google.com/document/") != -1) { // is a Google Docs link to embed
        var htmlFrame = "<a href=" + videoLink + ">Instructions on Google Docs</a>";
        $('#video').append(htmlFrame);
    }

    // $("#title").append("<h2>" + product.Name + "</h2>")
    $("#desc").append("<p tabindex='0'>" + product.Notes + "</p> <p tabindex='0'> <strong>Product ID/Serial Code:</strong> " + product.ProductId + "</p>")

    $("#category").append("<span tabindex='0'><u>Product Type:</u> </span>" + product.Type)

    function generateGetInfo(mode) {
        $("#get-info").append("<div style='margin-top: 0px; margin-bottom: 20px'>")

        const description = (mode === "buy") ? "Purchase from a retailer: "
            : (mode === "borrow") ? "Borrow from a partner: "
                : "Make from instructions: "

        const availability = (mode === "buy") ? getProductAvailability(product.buyable)
            : (mode === "borrow") ? getProductAvailability(product.borrowable)
                : getProductAvailability(product.makable)

        $("#get-info").append("<span style='font-size: 18px' tabindex='0'>" + description + availability + "</span>")

        let redirect = (mode === "buy") ? product['buy-link']
            : (mode === "borrow") ? "https://docs.google.com/forms/d/e/1FAIpQLScpE4-eZF0djVPW-D6StWxH5ADoyeqj1Pc7-Qc-BpjEExucnQ/viewform?usp=pp_url&entry.1617628070=" + product.ProductId
                : product['make-link']

        const link = (redirect === "") ? "" : redirect
        const a_href = document.createElement('a')
        a_href.setAttribute('href', link)
        a_href.setAttribute('tabindex', '0')


        const button = document.createElement('button')
        button.setAttribute('class', 'btn btn--primary')
        button.setAttribute('tabindex', '0')
        button.setAttribute('role', 'button')
        const buttonText = (mode === "buy") ? "Link to Purchase"
            : (mode === "borrow") ? "Link to Borrow"
                : "Link to Make"
        button.innerHTML = buttonText
        if (link === "" || availability === "Not Available") {
            button.disabled = true;
        }

        a_href.append(button)

        $("#get-info").append(a_href)

        $("#get-info").append("</div>")
    }

    generateGetInfo("buy")
    generateGetInfo("borrow")
    generateGetInfo("make")

    Object.keys(validFeatures).forEach(function (key) {
        $('#features-product').append("<li tabindex='0'>" + validFeatures[key] + ": " + product[key] + "</li>")
    })
}