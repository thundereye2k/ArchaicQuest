﻿$(function () {

    //================================================================================
    // Setup the auto-generated proxy for the hub.
    //================================================================================

    var chat = $.connection.mIMHub;
    var client = chat.client;
    var server = chat.server;

    //================================================================================
    // Global Variables for playerCreation
    //================================================================================
    var race = "Human";
    var playerClass;
    var gender;
    var name;
    var email;
    var password;

    //================================================================================
    // Helper Functions
    //================================================================================
    var MIM = {
        getRaceInfo: function (getValue) {
            server.characterSetupWizard(getValue, "race");
        },
        getClassInfo: function (getValue) {
            server.characterSetupWizard(getValue, "class");
        },
        selectOption: function () {
            $(".modal-body a").click(function () {

                if ($(this).hasClass("active")) {

                    //don't call server if same tab
                    return false;
                }
                else {
                    $(".modal-body a").removeClass("active");
                    $(this).addClass("active");

                    var getValue = $(this).text().trim().toLowerCase().toString();

                    if ($('#select-race').is(':visible')) {
                        MIM.getRaceInfo(getValue)
                    }
                    else if ($('#select-class').is(':visible')) {
                        MIM.getClassInfo(getValue)
                    }

                   
                }
            });

        },
        CharacterNextStep: function () {
            var raceStep = document.getElementById('select-race');
            var classStep = document.getElementById('select-class');
            var statsStep = document.getElementById('select-stats');
            var infoStep = document.getElementById('select-char');

            $("#RaceSelectedBtn").click(function () {
                MIM.getClassInfo("fighter");
                raceStep.style.display = "none";
                classStep.style.display = "block";
                $(".modal-header div").removeClass("active");
                $(".classBreadCrumb").addClass("active");
            });

            $("#backToRace").click(function () {         
                raceStep.style.display = "block";
                classStep.style.display = "none";
                $(".modal-header div").removeClass("active");
                $(".raceBreadCrumb").addClass("active");
            });


            $("#selectedClassBtn").click(function () {
                server.getStats();
                classStep.style.display = "none";
                statsStep.style.display = "block";
                $(".modal-header div").removeClass("active");
                $(".statsBreadCrumb").addClass("active");
            });

            $("#backToClass").click(function () {
                 
                classStep.style.display = "block";
                statsStep.style.display = "none";
                $(".modal-header div").removeClass("active");
                $(".classBreadCrumb").addClass("active");
            });

            $("#reRollStats").click(function() {
                server.getStats();
            });

            $("#selectedStatsBtn").click(function () {
               // server.getStats();
                statsStep.style.display = "none";
                infoStep.style.display = "block";
                $(".modal-header div").removeClass("active");
                $(".infoBreadCrumb").addClass("active");
            });

        },
        sendMessageToServer: function() {
            $('#sendmessage').click(function () {

                var message = $('#message');

                // Call the Send method on the hub.
                server.recieveFromClient(message.val());

                message.select().focus();
            });
        },
        htmlEncode: function (value) {
            var encodedValue = $('<div />').text(value).html();
            return encodedValue;
        },
        init: function () {
            console.log("INIT")
            //init when signalr is ready
            MIM.selectOption();
            MIM.CharacterNextStep();
        }
    }


    //// Set focus to input box ////
    $('#message').focus();

    //================================================================================
    // Client Functions
    //================================================================================


    //// Add a new message to the page ////
    client.addNewMessageToPage = function (message) {
        $('#discussion').append("<p>" + MIM.htmlEncode(message) + "</p>");
    };

    //// Update Race Info ////
    client.updateCharacterSetupWizard = function (step, dataName, dataHelp, dataImg) {

        var info = "<h2>" + dataName + "</h2>" + "<p>" + dataHelp + "</p>";

        if (step === "race") {
            race = dataName; //global Race

            $('.raceInfo').html(info);

            $('.raceImg').attr('src', dataImg);
        }
        else if (step === "class") {
            playerClass = dataName; //global player Class
            $('.classInfo').html(info);

            $('.classImg').attr('src', dataImg);
        }

        console.log(dataName + " " + dataHelp )

     

    }

    //// generate Stats ////
    client.setStats = function (stats) {
        $('#statStr').html(stats[0]);
        $('#statDex').html(stats[1]);
        $('#statCon').html(stats[2]);
        $('#statInt').html(stats[3]);
        $('#statWis').html(stats[4]);
        $('#statCha').html(stats[5]);
    }



    //================================================================================
    // Hub has loaded & Server functions
    //================================================================================
    $.connection.hub.start().done(function () {

        //// Load 1st race choice
         MIM.getRaceInfo("human"); //set default;

        //server.welcome();
        server.loadRoom();
   
        /// send info to server
        MIM.sendMessageToServer();

        //// Start scripts
        MIM.init();

        });
        
    });

 
