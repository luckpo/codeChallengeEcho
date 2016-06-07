var apiURL = 'http://localhost:4001/api';

$("#searchButton").click(function(e) {
    if ($("#searchField").val()) {
        $.get(apiURL+'/medications/'+$("#searchField").val(), function(apiData) {
            console.log("calling " + apiURL+'/medications/'+$("#searchField").val());
            if (apiData.error) {
                console.log("medication not found")
            } else {
                $("#srvMessage").html("Got data : " + apiData.name + " // " + apiData.description);

                //Made the firebase part here, IMO it's better to have it on the server. Tried to do it with a hook in "common/models/medication.js" but couldn't make it work
                firebase.database().ref('/medicationVisit/'+$("#searchField").val()).once('value').then(function(snapshot) {

                    if (snapshot.val() && snapshot.val().count > 0) {
                        var newCount = parseInt(snapshot.val().count) + 1;
                        $("#srvMessage").html("Count (" + $("#searchField").val() + ") : " + newCount)
                        firebase.database().ref('/medicationVisit/'+$("#searchField").val()).set({
                            count: newCount,
                            exists: true
                        });
                    } else {
                        firebase.database().ref('/medicationVisit/'+$("#searchField").val()).set({
                            count: 1,
                            exists: false
                        });
                    }


                });
            }
            })
            .fail(function(e) {
                var errorObj = JSON.parse(e.responseText)
                $("#srvMessage").html("Error : " + errorObj.error.code + " // " + errorObj.error.message );
            })
    } else {
        console.log("empty search input :( ");
    }





})

$("#addButton").click(function(e) {
    if ($("#medName").val() && $("#medDesc").val()) {
        $.post(apiURL+'/medications/',{name: $("#medName").val(), description: $("#medDesc").val() }, function(apiData) {
                console.log("calling " + apiURL+'/medications/ : post data : '+ $("#medName").val() + ' // ' + $("#medDesc").val() );
                if (apiData.error) {
                    console.log("Error inserting a medication")
                } else {
                    $("#srvMessage").html("Inserted : " + apiData.name + " // " + apiData.description);
                }
            })
            .fail(function(e) {
                var errorObj = JSON.parse(e.responseText)
                $("#srvMessage").html("Error : " + errorObj.error.code + " // " + errorObj.error.errmsg );
            })    } else {
        console.log("empty medication fields :( ");
    }
})


