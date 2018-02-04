

var Fstop = 16;
var LightLevel;
var ShutterSpeed = .008;
var Iso = 100;
var Ev = 0;
var guideNumber = 0;
var ShutterSpeedText = "1/125"

var fstopPosition = 4;
var shutterSpeedPosition = 6;
var isoPosition = 2;


if (GetCookie("Fstop") != ""){
    Fstop = GetCookie("Fstop");
    ShutterSpeed = GetCookie("ShutterSpeed");
    Iso = GetCookie("Iso");
    Ev = GetCookie("Ev");
    LightLevel = GetCookie("LightLevel");
    guideNumber = GetCookie("guideNumber");
    ShutterSpeedText = GetCookie("ShutterSpeedText");
    fstopPosition = GetCookie("fstopPosition");
    shutterSpeedPosition = GetCookie("shutterSpeedPosition");
    isoPosition = GetCookie("isoPosition");
}


var shutterSpeedSlider = $('#ShutterSpeed').slider();
var shutterSpeedTooltip = $("#ShutterSpeed.tooltip.tooltip-inner");
var fStopTooltip;
var isoTooltip;
var flashDistMeter;
var flashDistFeet;

var newGuideNumber;

$(document).ready(function () {
    //This doesn't work because something is wrong with the Shutter Speed slider.
    //$("#ShutterSpeed").attr('data-slider-value', shutterSpeedPosition);
    
    $("#FStop").attr('data-slider-value', fstopPosition);
    $("#Iso").attr('data-slider-value', isoPosition);
    $("#GN").val(guideNumber);
    FlashCalc();
    calculation(ShutterSpeed, Fstop, Iso);
   
    
  
    // Reference: http://seiyria.com/bootstrap-slider/
    // With JQuery
    $("#ShutterSpeed").slider({       
        tooltip: 'always',
        formatter: function () {
            return ShutterSpeedText;
        }
    }).on('change', ShutterSpeed_Slide)
        .data('slider');

    $("#FStop").slider({
        tooltip: 'always',
        formatter: function () {
            return ("F " + Fstop);
        }
    }).on('change', FStop_Slide)
        .data('slider');

    $("#Iso").slider({
        tooltip: 'always',
        formatter: function () {
            return Iso;
        }
    }).on('change', Iso_Slide).data('slider');

    $("#GN")[0].addEventListener('input', FlashCalc, false);

      //Force change max value of sliders (couldn't get the data-slider-max value to work).
    $("#ShutterSpeed").slider('setAttribute', 'max', 17);
    $("#ShutterSpeed").slider('setAttribute', 'value', shutterSpeedPosition);
    $("#ShutterSpeed").slider('setAttribute', 'data-slider-handle', 'triangle');
    $("#ShutterSpeed").slider('setAttribute')
    $("#ShutterSpeed").slider('refresh');


    
    //var GN = document.getElementById("#GN")
        //GN.oninput = FlashCalc;

    
    window.addEventListener("beforeunload", function (e) {
      

        SetCookie("Fstop", Fstop);
        SetCookie("LightLevel", LightLevel);
        SetCookie("ShutterSpeed", ShutterSpeed);
        SetCookie("Iso", Iso);
        SetCookie("Ev", Ev);
        SetCookie("guideNumber", guideNumber);
        SetCookie("ShutterSpeedText", ShutterSpeedText);

        SetCookie("fstopPosition", fstopPosition);
        SetCookie("shutterSpeedPosition", shutterSpeedPosition);
        SetCookie("isoPosition", isoPosition);
        //var fstopPosition = 4;
        //var shutterSpeedPosition = 0;
        //var isoPosition = 2;
    }, false);   
})



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

function SetCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function GetCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1); 
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function calculation(ShutterSpeed, Fstop, Iso) {
    var cdpm2;
    var exposure;
    var exposure1;

    //set exposure to 15, sunny (and then subtract 3 as per formula)
    cdpm2 = Math.pow(2, 12);
    exposure1 = ((12.5 * (Math.pow(Fstop, 2)) / (ShutterSpeed * Iso)) - cdpm2);
    //console.log("exposure 1: " + exposure1);
    exposure = (-1 * (((Math.log(cdpm2 + exposure1) / Math.log(2)) + 3) - ((Math.log(cdpm2) / Math.log(2)) + 3)));
    //console.log(exposure);

    var message = '';
    if (exposure > -0.5 && exposure < 0.5) {
        message = "Level 15 - Sunny";
    } else if (exposure > -1.5  && exposure < -.5 ) {
        message = "Level 16 - Bright daylight on sand or snow";
    } else if (exposure > -2.5 && exposure < -1.5) {
        message = "Level 17 - Unnaturally bright";
    } else if (exposure > -3.5 && exposure < -2.5) {
        message = "Level 18 - Unnaturally bright";
    } else if (exposure > -4.5 && exposure < -3.5) {
        message = "Level 19 - Unnaturally bright";
    } else if (exposure < -4.6) {
        message = "Level 20+ - Unnaturally bright";
    } else if (exposure > 0.5 && exposure < 1.5) {
        message = "Level 14 - Hazy sun";
    } else if (exposure > 1.5 && exposure < 2.5) {
        message = "Level 13 - Cloudy-bright light (no shadows)";
    } else if (exposure > 2.5 && exposure < 3.5) {
        message = "Level 12 - Shade or overcast";
    } else if (exposure > 3.5 && exposure < 4.5) {
        message = "Level 11 - Sunset or deep shade";
    } else if (exposure > 4.5 && exposure < 5.5) {
        message = "Level 10 - Immediately after sunset";
    } else if (exposure > 5.5 && exposure < 6.5) {
        message = "Level 9 - Neon lights, spotlighted subjects";
    } else if (exposure > 6.5 && exposure < 7.5) {
        message = "Level 8 - Fires, stadiums at night, bright indoor florescent lights";
    } else if (exposure > 7.5 && exposure < 8.5) {
        message = "Level 7 - Night time streets, indoor sports, stage shows.";
    } else if (exposure > 8.5 && exposure < 9.5) {
        message = "Level 6 - Brigthly lit home interiors, amusement parks";
    } else if (exposure > 9.5 && exposure < 10.5) {
        message = "Level 5 - Night home interiors, average light, auditoriums, subjects lit by fire";
    } else if (exposure > 10.5 && exposure < 11.5 ) {
        message = "Level 4 - Candle light, Christmas lights, floodlights, street lamps.";
    } else if (exposure > 11.5 && exposure < 12.5) {
        message = "Level 3 - Fireworks (with long exposure)";
    } else if (exposure > 12.5 && exposure < 13.5) {
        message = "Level 2 - Lightning (with long exposure)";
    } else if (exposure > 13.5 && exposure < 14.5) {
        message = "Level 1 - Distant view of lighted skyline";
    } else if (exposure > 14.5) {
        message = "Level 0 or less - Dim ambient light"
    }
    else {
        message = "Unknown";
    }

    $('#ev').text(message);

    return (exposure);
}

function ShutterSpeed_Slide(e) {
    shutterSpeed_Slider = parseInt($(this).val());
    shutterSpeedPosition = shutterSpeed_Slider;
    //console.log("shutterSpeed_Slider = " + shutterSpeed_Slider);
    if (shutterSpeed_Slider == 0) {
        ShutterSpeed = 1 / 8000;
        ShutterSpeedText = "1/8000 s"
    } else if (shutterSpeed_Slider == 1) {
        ShutterSpeed = 1 / 4000;
        ShutterSpeedText = "1/4000 s"
    } else if (shutterSpeed_Slider == 2) {
        ShutterSpeed = 1 / 2000;
        ShutterSpeedText = "1/2000 s"
    } else if (shutterSpeed_Slider == 3) {
        ShutterSpeed = 1 / 1000;
        ShutterSpeedText = "1/1000 s"
    } else if (shutterSpeed_Slider == 4) {
        ShutterSpeed = 1 / 500;
        ShutterSpeedText = "1/500 s";
    } else if (shutterSpeed_Slider == 5) {
        ShutterSpeed = 1 / 250;
        ShutterSpeedText = "1/250 s";
    } else if (shutterSpeed_Slider == 6) {
        ShutterSpeed = 1 / 125;
        ShutterSpeedText = "1/125 s";
    } else if (shutterSpeed_Slider == 7) {
        ShutterSpeed = 1 / 60;
        ShutterSpeedText = "1/60 s";
    } else if (shutterSpeed_Slider == 8) {
        ShutterSpeed = 1 / 30;
        ShutterSpeedText = "1/30 s";
    } else if (shutterSpeed_Slider == 9) {
        ShutterSpeed = 1 / 15;
        ShutterSpeedText = "1/15 s";
    } else if (shutterSpeed_Slider == 10) {
        ShutterSpeed = 1 / 8;
        ShutterSpeedText = "1/8 s";
    } else if (shutterSpeed_Slider == 11) {
        ShutterSpeed = 1 / 4;
        ShutterSpeedText = "1/4 s";
    } else if (shutterSpeed_Slider == 12) {
        ShutterSpeed = 1 / 2;
        ShutterSpeedText = "1/2 s";
    } else if (shutterSpeed_Slider == 13) {
        ShutterSpeed = 1;
        ShutterSpeedText = "1 s";
    } else if (shutterSpeed_Slider == 14) {
        ShutterSpeed = 2;
        ShutterSpeedText = "2 s";
    } else if (shutterSpeed_Slider == 15) {
        ShutterSpeed = 4;
        ShutterSpeedText = "4 s";
    } else if (shutterSpeed_Slider == 16) {
        ShutterSpeed = 8;
        ShutterSpeedText = "8 s";
    } else if (shutterSpeed_Slider == 17) {
        ShutterSpeed = 15;
        ShutterSpeedText = "15 s";
    }

    FlashCalc();
    $("#ShutterSpeedDisplay").text(ShutterSpeedText);
    Ev = calculation(ShutterSpeed, Fstop, Iso);
}

function FStop_Slide(e) {
    Fstop_slider = parseInt($(this).val());
    fstopPosition = Fstop_slider;
    //console.log("Fstop_slider = " + Fstop_slider);
    if (Fstop_slider == 0) {
        Fstop = 64;
    } else if (Fstop_slider == 1) {
        Fstop = 45;
    } else if (Fstop_slider == 2) {
        Fstop = 32;
    } else if (Fstop_slider == 3) {
        Fstop = 22;
    } else if (Fstop_slider == 4) {
        Fstop = 16;
    } else if (Fstop_slider == 5) {
        Fstop = 11;
    } else if (Fstop_slider == 6) {
        Fstop = 8;
    } else if (Fstop_slider == 7) {
        Fstop = 5.6;
    } else if (Fstop_slider == 8) {
        Fstop = 4;
    } else if (Fstop_slider == 9) {
        Fstop = 2.8;
    } else if (Fstop_slider == 10) {
        Fstop = 2;
    } else if (Fstop_slider == 11) {
        Fstop = 1.4;
    } else if (Fstop_slider == 12) {
        Fstop = 1;
    } else {
        Fstop = "unknown";
    }
    FlashCalc();
    $("#FStopDisplay").text("F " + Fstop);
    Ev = calculation(ShutterSpeed, Fstop, Iso);
    // console.log('changed', e.value);
}

function Iso_Slide() {
    iso_slider = parseInt($(this).val());
    isoPosition = iso_slider;
    if (iso_slider == 0) {
        Iso = 25;
    } else if (iso_slider == 1) {
        Iso = 50;
    } else if (iso_slider == 2) {
        Iso = 100;
    } else if (iso_slider == 3) {
        Iso = 200;
    } else if (iso_slider == 4) {
        Iso = 400;
    } else if (iso_slider == 5) {
        Iso = 800;
    } else if (iso_slider == 6) {
        Iso = 1600;
    } else if (iso_slider == 7) {
        Iso = 3200;
    } else {
        Iso = "unknown";
    }
    FlashCalc();
    $("#IsoDisplay").text(Iso);
    Ev = calculation(ShutterSpeed, Fstop, Iso);
}

function FlashCalc() {
    // alert("FlashCalc called");
    //var gn = document.getElementById('GN').value;
    calculateGN();
    var gn = Number(newGuideNumber);
    flashDistMeter = gn / Fstop;
    flashDistMeter = roundTwoDecimal(flashDistMeter);
    flashDistFeet = flashDistMeter * 3.28084;
    flashDistFeet = roundTwoDecimal(flashDistFeet);
    //if (flashDistMeter.toString().length < 4) {
    //    flashDistMeter = flashDistMeter.toString() + '&nbsp ';
    //} else if (flashDistMeter.toString().lenght < 3) {
    //    flashDistMeter = flashDistMeter.toString() + '&nbsp &nbsp';
    //} else if (flashDistMeter.toString().lenght < 2) {
    //    flashDistMeter = flashDistMeter.toString() + '&nbsp &nbsp &nbsp';
    //}
    $("#GNDisplayMeters").text(flashDistMeter + ' m');
    $("#GNDisplayFeet").text(flashDistFeet + ' ft');
    if (flashDistMeter == 0) {
        $("#GNDisplayMeters").text("0.00 m");
        $("#GNDisplayFeet").text("0.00 ft");
    }
}

function calculateGN() {
    var gn = document.getElementById('GN').value;
    var iso = Iso;
    var isoSteps = 0;
    guideNumber = gn;
    newGuideNumber = gn;


    function findIsoSteps(iso) {
        if (iso == 100) {
            //alert("ISO Steps: " + isoSteps);
            return isoSteps;
        } else if (iso > 100) {
            isoSteps += 1;
            iso = iso / 2;
            findIsoSteps(iso);
        } else if (iso < 100) {
            isoSteps -= 1;
            iso = iso * 2;
            findIsoSteps(iso);
        }
    }

    function solveForGN(isoSteps) {
        if (isoSteps == 0) {
            //console.log("Guide Number: " + newGuideNumber + "Type: " + typeof (newGuideNumber));
            return Number(newGuideNumber);
        } else if (isoSteps > 0) {
            //console.log("current GN: " + newGuideNumber);
            newGuideNumber = Number(newGuideNumber) * Math.sqrt(2);
            isoSteps -= 1;
            solveForGN(isoSteps);
        } else if (isoSteps < 0) {
            newGuideNumber = Number(newGuideNumber) / Math.sqrt(2);
            isoSteps += 1;
            solveForGN(isoSteps);
        }

    }

    findIsoSteps(Iso);
    solveForGN(isoSteps);
}

function roundTwoDecimal(num) {
    return Math.round(num * 100) / 100;
}






