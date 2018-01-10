// Write your JavaScript code.
$(document).ready(function () {
    var Ev = 0;
    var Fstop = 16;
    var LightLevel;
    var ShutterSpeed = .008;
    var Iso = 100;

    //$("input[name=LightLevel]").on('input', function () {
    //    LightLevel = $(this).val();
    //    calculation(ShutterSpeed, Fstop, Iso);

    //});

    $("input[name=FStop]").on('input', function () {
        //debugger;
        Fstop = parseFloat($(this).val());
        Ev = calculation(ShutterSpeed, Fstop, Iso);
    });

    $("input[name=ShutterSpeed]").on('input', function () {
        ShutterSpeed = parseFloat($(this).val());
        Ev = calculation(ShutterSpeed, Fstop, Iso);
    });

    $("input[name=Iso]").on('input', function () {
        Iso = parseInt($(this).val());
        Ev = calculation(ShutterSpeed, Fstop, Iso);
    })
    /*
    LightLevel = $(input[name = LightLevel]);
    ShutterSpeed = $(input[name = ShutterSpeed]);
    */


});


//Formula from NetLogo code
//to calculateExposure
//set cdpm2 (2 ^ (EVFloat - 3))
//    ;; formula fstop^ 2 / shutterSpeed = (Luminance + exposureDifference) * ISO / 12.5
//    ;; First solve for the luminance difference, x in cd / m2  x
//let exposure1 ((12.5 * (F-stopFloat ^ 2)) / (ShutterSpeedFloat * ISOFloat)) - cdpm2
//    
//    ;; then convert L+ x and L into EV, and subtract difference in units EV to solve for exposure
//    ; ; avoiding taking the log of a negative number
//    ;; L + x - L = x
//set exposure (-1 * (((log(cdpm2 + exposure1) 2) + 3) - ((log(cdpm2) 2) + 3)))

function calculation(ShutterSpeed, Fstop, Iso) {
    var cdpm2;
    var exposure;
    var exposure1;

    //set exposure to 15, sunny (and then subtract 3 as per formula)
    cdpm2 = Math.pow(2, 12);
    exposure1 = ((12.5 * (Math.pow(Fstop, 2)) / (ShutterSpeed * Iso)) - cdpm2);
    //console.log("exposure 1: " + exposure1);
    exposure = (-1 * (((Math.log(cdpm2 + exposure1) / Math.log(2)) + 3) - ((Math.log(cdpm2) / Math.log(2)) + 3)));
    console.log(exposure);

    var message = '';
    if (exposure > -0.5 && exposure < 0.5) {
        message = "Level 15 - Sunny";
    } 
        else if (exposure > 0.5 && exposure < 1.5) {
        message = "Level 16 - Over-Exposed";
    }
        else if (exposure > 1.5 && exposure < 2.5) {
        message = "Level 17 - Over-Exposed";
    }

        else if (exposure > 2.5 && exposure < 3.5) {
        message = "Level 18 - Over-Exposed";
    }

    else if (exposure > 3.5 && exposure < 4.5) {
        message = "Level 19 - Over-Exposed";
    }
    else if (exposure > 4.6)
    {
        message = "Level 20+ - Over-Exposed";
    }
    else {
        message = "Unknown";
    }

    $('#ev').text(message);
    //field = browser.Document.GetElementByTagName("Ev");
   // field.SetAttribute("value", exposure);
   // $("h3[name=Ev]").text(exposure.toLocaleString());
   // $("h3[name=Ev]").html("<h3>" + exposure + "</h3>");
    //document.getElementByName("Ev").innerHTML = exposure;
    /*
    $("output[name=Ev]").html(function () {
        return '<h3>' + exposure + '</h3>';
        //$("output[name=Ev]").val(exposure);
    })
    */
    return (exposure);
}
