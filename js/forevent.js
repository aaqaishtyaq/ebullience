$(document).ready(function(){
    if(navigator.cookieEnabled=='false'){
        alert('Please Enable Cookie and Visit Us Again');
        window.location="http://www.wikihow.com/Enable-Cookies-in-Your-Internet-Web-Browser.html";
    }
    else if(getCookie("email")!=""){
        if(getCookie("basics")==0){
            $.getJSON('dataset/academics.json', function (data) {
                var items=[];
                $.each(data.branch, function(key, val) {
                    items.push("<option value='"+ val +"'>"+ val +"</option>");
                });

                $("#basic_details_form #branch").append(items.join(""));
                $.each(data.year, function(key, val) {
                    items.push("<option value='"+ val +"'>"+ val +"</option>");
                });

                $("#basic_details_form #year").append(items.join(""));
                $.each(data.section, function(key, val) {
                    items.push("<option value='"+ val +"'>"+ val +"</option>");
                });

                $("#basic_details_form #section").append(items.join(""));
            });

            $('#basic_details').fadeIn('slow');

            $('#basic_details_form #rollno').on("focus blur",function(){
                if($('#basic_details_form #rollno')[0].value!=''){
                    $.ajax({
                        url:"https://ebullience.herokuapp.com/checkrollno.php",
                        data:{
                            "rollno":$('#basic_details_form #rollno')[0].value,
                        },
                        cache: false,
                        dataType: 'jsonp',
                        success:function(json){
                            console.log(json);
                            if(json['error']!=0){
                                alert('Please Try Again Later');
                            }
                            else{
                                if(json['unique']!=1){
                                    $('#basic_details_form #rollno')[0].value='';
                                    $('#basic_details_form #rollno')[0].placeholder='ALREADY REGISTERED! TRY ANOTHER!';
                                }
                                else{
                                    $('#basic_details_form #rollno')[0].placeholder='';
                                }
                            }
                        },
                        error:function(){
                            alert("Please Try Again Later!");
                        }      
                    });
                }
            });

            $("#basic_details_form").submit(function(event) {
                var formdata=$('#basic_details_form').serializeArray();
                $.ajax({
                        url:"https://ebullience.herokuapp.com/checkrollno.php",
                        data:{
                            "rollno":$('#basic_details_form #rollno')[0].value,
                        },
                        cache: false,
                        dataType: 'jsonp',
                        success:function(json){
                            console.log(json);
                            if(json['error']!=0){
                                alert('Please Try Again Later');
                            }
                            else{
                                if(json['unique']!=1){
                                    $('#basic_details_form #rollno')[0].value='';
                                    $('#basic_details_form #rollno')[0].placeholder='ALREADY REGISTERED! TRY ANOTHER!';
                                }
                                else{
                                    $.ajax({
                                        url:"https://ebullience.herokuapp.com/submitbasics.php",
                                        data: {
                                          "email": getCookie("email"),
                                          "phone": formdata[0].value,
                                          "rollno": formdata[1].value,
                                          "branch": formdata[2].value,
                                          "section": formdata[3].value,
                                          "year": formdata[4].value,
                                          "visits": Number(getCookie("visits"))+1,
                                        },
                                        cache: false,
                                        dataType: 'jsonp',
                                        success:function(json){
                                            console.log(json);
                                            if(json['error']!=0){
                                                alert('Please Try Again Later');
                                            }
                                            else{
                                                setCookie("phone", formdata[0].value,100);
                                                setCookie("rollno", formdata[1].value,100);
                                                setCookie("branch", formdata[2].value,100);
                                                setCookie("section", formdata[3].value,100);
                                                setCookie("year", formdata[4].value,100);
                                                setCookie("visits", Number(getCookie("visits"))+1,100);
                                                setCookie("basics",1,100);
                                                location.reload();
                                            }
                                        },
                                        error:function(){
                                            alert("Please Try Again Later!");
                                        }      
                                    });
                                }
                            }
                        },
                        error:function(){
                            alert("Please Try Again Later!");
                        }      
                    });
                event.preventDefault();
            });
        }
        else{
            $('#profile_description_name')[0].innerHTML=getCookie('name');
            $('#profile_description_email')[0].innerHTML=getCookie('email');
            $('#profile_description_phone')[0].innerHTML=getCookie('phone');
            $('#profile_description_branch')[0].innerHTML=getCookie('branch');
            $('#profile_description_section')[0].innerHTML=getCookie('section');
            $('#profile_description_year')[0].innerHTML=getCookie('year');
            $('#profile_description_registered')[0].innerHTML=getCookie('totalregistered')+" registered events.";
            $('#user_image')[0].src=getCookie('picture');
            setTimeout(load_event_page, 1000);
            function load_event_page(){
                $('#user_image').fadeIn('slow', function(){
                    if($(window).width()>=900){
                            $('#Profile').css('transform','translate(-290%,-150%)');
                            $('#profile_description').css('opacity','1');
                            $('#profile_description').css('transform','translate(-180%,-20%)');
                            $('#dashboard').css('width','650px');
                            $('#dashboard').css('opacity','1');
                            $('#dashboard').css('transform','translate(+15%,-0.5%)');
                    }
                    else if($(window).width()>=700){
                        $('#Profile').css('transform','translate(-200%,-150%)');
                        $('#profile_description').css('opacity','1');
                        $('#profile_description').css('transform','translate(-125%,-20%)');
                        $('#dashboard').css('width','450px');
                        $('#dashboard').css('opacity','1');
                        $('#dashboard').css('transform','translate(+20%,-0.5%)');
                    }
                    else{
                        $('#Profile').css('transform','translate(0px,-150%)');
                        $('#profile_description').css('opacity','1');
                        $('#profile_description').css('transform','translate(0px,-20%)');
                        $('#dashboard').css('width','90%');
                        $('#dashboard').css('opacity','1');
                        $('#dashboard').css('transform','translate(0px,+80%)');
                    }
                });
            }

            $('#dashboard_nav_events').click(function(){
                change_dashboard('#dashboard_nav_events', '#dashboard_nav_registered', '#dashboard_nav_notification', '#dashboard_events', '#dashboard_registered', '#dashboard_notification');
            });

            $('#dashboard_nav_registered').click(function(){
                change_dashboard('#dashboard_nav_registered', '#dashboard_nav_events', '#dashboard_nav_notification', '#dashboard_registered', '#dashboard_events', '#dashboard_notification');
            });

            $('#dashboard_nav_notification').click(function(){
                change_dashboard('#dashboard_nav_notification', '#dashboard_nav_registered', '#dashboard_nav_events', '#dashboard_notification', '#dashboard_registered', '#dashboard_events');
            });

            function change_dashboard(first_nav, second_nav, third_nav, first_dash, second_dash, third_dash){
                //alert();
                if($(first_nav).css('color')!='rgb(255, 255, 255)' & $(first_nav).css('color')!='white' & $(first_nav).css('color')!='ffffff' & $(first_nav).css('color')!='	ff'){
                    $('#dashboard').css('border-color', $(first_nav).css('color'));
                    $('#dashboard #dashboard_nav ul').css('border-bottom-color', $(first_nav).css('color'));
                }

                $(first_nav).css('color','white');
                $(first_nav+' .back').css('transform', 'scale(1)');
                $(first_nav+' .back').css('opacity', '1');

                $(second_nav+' .back').css('transform', 'scale(0.1)');
                $(second_nav+' .back').css('opacity', '0');
                $(third_nav+' .back').css('transform', 'scale(0.1)');
                $(third_nav+' .back').css('opacity', '0');

                $(second_dash).fadeOut(1);
                $(third_dash).fadeOut(1 , function(){
                    $(first_dash).fadeIn(1000);
                });

                change_color(second_nav);
                change_color(third_nav);

                function change_color(nav){
                    if(nav=='#dashboard_nav_registered'){
                        $(nav).css('color','rgb(15,157,88)');
                    }
                    else if(nav=='#dashboard_nav_events'){
                        $(nav).css('color','rgb(244,180,0)');
                    }
                    else{
                        $(nav).css('color','rgb(57,123,249)');
                    }
                }

            }

            $('#dashboard_nav_mobile_selected').click(function(){
                $('#dashboard_nav_mobile').toggle(500);
            })

            $('#dashboard_nav_mobile li').click(function(){
                $('#dashboard_nav_mobile').toggle(500);
                change_mobile_dashboard(this.id);
            });

            function change_mobile_dashboard(selected_nav){
                if(selected_nav=='dashboard_nav_mobile1'){
                    change_color('rgb(244,180,0)');
                    $('#dashboard_nav_mobile_selected h3')[0].innerHTML='Events';
                    $('#dashboard_registered').fadeOut(1);
                    $('#dashboard_notification').fadeOut(1 , function(){
                        $('#dashboard_events').fadeIn(1000);
                    });
                }
                else if(selected_nav=='dashboard_nav_mobile2'){
                    change_color('rgb(15,157,88)');
                    $('#dashboard_nav_mobile_selected h3')[0].innerHTML='Registered';
                    $('#dashboard_events').fadeOut(1);
                    $('#dashboard_notification').fadeOut(1 , function(){
                        $('#dashboard_registered').fadeIn(1000);
                    });
                }
                else{
                    change_color('rgb(57,123,249)');
                    $('#dashboard_nav_mobile_selected h3')[0].innerHTML='Notification';
                    $('#dashboard_events').fadeOut(1);
                    $('#dashboard_registered').fadeOut(1 , function(){
                        $('#dashboard_notification').fadeIn(1000);
                    });
                }
                function change_color(color){
                    $('#dashboard_nav_mobile_selected').css('background-color', color);
                    $('#dashboard').css('border-color', color);
                    $('#dashboard_nav_mobile ul').css('background-color', color);
                }
            }
        }
    }
    else{
        alert("Please Login First!");
        window.location="/ebullience/";
    }

    // Generic Cookie Handling Functions

	function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
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

	function checkCookie() {
		var user = getCookie("username");
		if (user != "") {
			alert("Welcome again " + user);
		} else {
			user = prompt("Please enter your name:", "");
			if (user != "" && user != null) {
				setCookie("username", user, 365);
			}
		}
	}
});