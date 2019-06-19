﻿var queryStringParamerterSort = "s";
var queryStringParamerterSortDirection = "sd";
var queryStringParamerterSortDirectionAsc = "asc";
var queryStringParamerterSortDirectionAscShort = "+";
var queryStringParamerterSortDirectionDesc = "desc";
var queryStringParamerterPage = "pg";
var queryStringParamerterPageSize = "ps";

function resetUrl() {
    var url = new Uri(window.location.href)
        .deleteQueryParam(queryStringParamerterSort)
        .deleteQueryParam(queryStringParamerterSortDirection)
        .deleteQueryParam(queryStringParamerterPage)
        .deleteQueryParam(queryStringParamerterPageSize)
        .deleteQueryParam(queryStringParameterSiteContentPage)
        .deleteQueryParam(queryStringParameterSiteContentPageSize)
        .toString();

    window.location.href = url;
}

$(document).ready(function () {
    $(".sort-dropdown", '.cxa-productlistheader-component').change(function () {
        var val = $(this).find("option:selected").attr("value");

        if (val != null && val != "") {
            var fieldName = val.substr(0, val.length - 1);
            var direction = val.charAt(val.length - 1) == queryStringParamerterSortDirectionAscShort ? queryStringParamerterSortDirectionAsc : queryStringParamerterSortDirectionDesc;

            
            AjaxService.Post("/api/cxa/catalog/sortorderapplied", JSON.parse("{\"sortField\":\"" + fieldName + "\", \"sortDirection\":\"" + direction + "\"}"), function (data, success, sender) {
                var url = new Uri(window.location.href)
                    .deleteQueryParam(queryStringParamerterSort)
                    .deleteQueryParam(queryStringParamerterSortDirection)
                    .addQueryParam(queryStringParamerterSort, fieldName)
                    .addQueryParam(queryStringParamerterSortDirection, direction)
                    .deleteQueryParam(queryStringParamerterPage)
                    .toString();

                window.location.href = url;
            });
        }
        else {
            resetUrl();
        }
    });

    $(".change-pagesize", '.cxa-productlistheader-component').change(function () {
        var val = $(this).find("option:selected").attr("value");

        if (val != null && val != "") {
            var url = new Uri(window.location.href)
                .deleteQueryParam(queryStringParamerterPageSize)
                .addQueryParam(queryStringParamerterPageSize, val)
                .deleteQueryParam(queryStringParamerterPage)
                .toString();

            window.location.href = url;
        }
        else {
            resetUrl();
        }
    });

});
