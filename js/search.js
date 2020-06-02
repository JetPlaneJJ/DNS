document.getElementById("search-btn").addEventListener("click", searchButtonClick);
function searchButtonClick() {
    var query = getQueryString();
    $.get("/searchquery", $.param(query), function (data) {
        window.sessionStorage.removeItem("queryResult");
        window.sessionStorage.setItem("queryResult", JSON.stringify(data));
        window.sessionStorage.removeItem("userQuery");
        window.sessionStorage.setItem("userQuery", JSON.stringify(query));
        window.location.href = "categories.html";
    })    
}

function getQueryString() {
    var queryString = {};
    var productTypes = [];
    var features = [];
    $("#tags li").each(function() {
        let tagText = $(this).text();
        let content = tagText.substr(0, tagText.length - 1);
        if ($(this).hasClass("device-type")) {
            productTypes.push(content);
        } else {
            features.push(content);
        }
    });
    if (productTypes.length > 1) {
        // Allow for Multiple product type searches with the OR operator
        var orClause = {"$or": []};
        productTypes.forEach((content) => {
            orClause["$or"].push({"Type": content});
        })
        var andClause = {"$and": [orClause]};
        features.forEach((content) => {
            var feature = {};
            feature[content] = "yes";
            andClause["$and"].push(feature);
        })
        queryString = andClause;
    } else if (features.length > 1 && productTypes.length == 0) {
        var orClause = {"$or": []};
        features.forEach((content) => {
            var feature = {};
            feature[content] = "yes";
            orClause["$or"].push(feature);
        })
        queryString = orClause;
    } 
    else {
        // implicit AND operator is used
        productTypes.forEach((content) => {
            queryString["Type"] = content;
        })
        features.forEach((content) => {
            queryString[content] = "yes";
        })
    }
    var Q = {
        query: queryString
    };
    return Q;
}

/*-------------------
		tag addition
--------------------- */
$('#tag-select').change(function () {
    var name = $(this).val();
    var tagList = [];
    $("#tags li").each(function () {
        tagList.push($(this).text());
    });
    if (!tagList.includes(name + "x")) {
        $("#tags").append("<li class='device-type' tabindex=0>" + name + "<button class='search-tag-close' tabindex=0>x</button></li>");
    }
});
$('#feature-select').change(function () {
    var name = $(this).val();
    var tagList = [];
    $("#tags li").each(function () {
        tagList.push($(this).text());
    });
    if (!tagList.includes(name + "x")) {
        $("#tags").append("<li class='feature' tabindex=0>" + name + "<button class='search-tag-close' tabindex=0>x</button></li>");
    }
});

$(document).on("click", '.search-tag-close', function () {
    $(this).parent().remove();
});