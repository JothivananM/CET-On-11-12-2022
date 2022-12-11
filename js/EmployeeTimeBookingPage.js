
// let empID = primaryDetails.EmployeeId; 
// let internalID = primaryDetails.BusinessPartnerId;
let employeeTimeagreementUUID=primaryDetails.EmployeeTimeAgrementUUID;
let employeeServiceID = primaryDetails.EmployeeService;

// let empID = 20;
// let internalID = 8000000010;
// let employeeTimeagreementUUID = "FA163ED8-C0B4-1EDD-88EF-19658EC5094E";

let employeeTimesheetList = [];

let calendarEvents = [];
let eventDetails = [];
let totalTaskDetails = [];

let availableTasks = [];
let availableActivities = ['Absent', 'Vacation'];

let availableSchools = [];
let availableContractList;
let contractList = [];
let availableHours = ['00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00',
                                '04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00'];

let trayObject = [];

let employeeItemUUID;
let employeeTimeUUID;

let cardDate = new Date().toISOString().slice(0, 10);
let cardCount = 1;
let dummycardCount=1;
let hoursStatus;
let newDetails, createData, updateData;

var date = new Date();
var firstDay = (new Date(date.getFullYear(), date.getMonth(), 2)).toISOString().slice(0,10);
var lastDay = (new Date(date.getFullYear(), date.getMonth() + 1, 1)).toISOString().slice(0,10);

var calendar;
////////////////////////////////////////////////////////////////////////////////////
///Start Common Function

    // Delete Previous Cards
    function deleteCard() {
        for (let index = 1; index <= cardCount; index++) {
            $('#div'+index).remove();
        }
        cardCount=1;
    }
    
    // Generate Calendar Events
    function getEvents (employeeTimesheetList) {
        calendarEvents = employeeTimesheetList;
        let hourBooked=0;
        
        for (let i=0; i<calendarEvents.length; i++) {
                
            hourBooked=parseFloat(calendarEvents[i].NotConfirmedHrs);
            
            if(hourBooked>0)
            {
                calendar.addEvent({
                    'id' : calendarEvents[i].Date+'N',
                    start: calendarEvents[i].Date,
                    title: parseInt(hourBooked) +':'+((hourBooked - Math.floor(hourBooked))*60).toString().split('.')[0],// calendarEvents[i].NotConfirmedHrs.substring(0,4)+'H',
                    color : "white",
                    textColor: "#6C757D",
                });
            }
            hourBooked=parseFloat(calendarEvents[i].ConfirmedHrs);
            if(hourBooked>0)
            {
                
                calendar.addEvent({
                    'id' : calendarEvents[i].Date+'C',
                    start: calendarEvents[i].Date,
                    title:  parseInt(hourBooked) +':'+((hourBooked - Math.floor(hourBooked))*60).toString().split('.')[0],//calendarEvents[i].ConfirmedHrs.substring(0,4)+'H',
                    color : "white",
                    textColor: "green",
                });
            }
            hourBooked=parseFloat(calendarEvents[i].RejectedHrs);
            if(hourBooked>0)
            {            
                calendar.addEvent({
                    'id' : calendarEvents[i].Date+'R',
                    start: calendarEvents[i].Date,
                    title:  parseInt(hourBooked) +':'+((hourBooked - Math.floor(hourBooked))*60).toString().split('.')[0],//calendarEvents[i].RejectedHrs.substring(0,4)+'H',
                    color : "white",
                    textColor: "red",
                });
            }
        }
    }
    // Autocomplete Task 
    function addSelect(divValue) {  

        let taskFilter = [];
        $('#'+divValue+' .task').autocomplete({
            source: availableTasks,
            minLength: 0,
            maxShowItems: 5,
            scroll: true,
            open: function(){
                $('.ui-autocomplete').css('width', '546px'); // HERE
            },
            
            select: function( event, ui ) {
          
                let separatedDetails = ui.item.label;

                taskFilter = totalTaskDetails.filter(el => {
                    return el.TaskDetails == separatedDetails;
                });
                // console.log(taskFilter.ProjectName);
                $('#'+divValue+' .project').attr('data-projectid',taskFilter[0].ProjectId);
                $('#'+divValue+' .project').val(taskFilter[0].ProjectName);

                $('#'+divValue+' .activity').attr('data-activityid',taskFilter[0].ActivityID);
                $('#'+divValue+' .activity').val(taskFilter[0].ActivityName);  
                
                $('#'+divValue+' .activity').prop('disabled','disabled')

            },
            // open: function(){
            //     $('.ui-autocomplete').css('width', '300px'); // HERE
            // },
            change: function (event, ui) {
                $('#'+divValue+' .task').val(taskFilter[0].TaskName);
                $('#'+divValue+' .task').attr('data-taskid',taskFilter[0].TaskID);
                $('#'+divValue+' .task').prop('disabled','disabled');
              },
        }).focus(function() {
            $(this).autocomplete("search", "");
        });

        // Autocomplete Activity
        $( '#'+divValue+' .activity').autocomplete({
            maxShowItems: 5,
            source: availableActivities,
            minLength: 0,
            scroll: true,
            select: function( event, ui ) {
                // alert("Select Event Triggered");
            },
            change: function (event, ui) {
               
                $('#'+divValue+' .activity').prop('disabled','disabled');
              }
          
            }).focus(function() {
            $(this).autocomplete("search", "");
          });

        
    //    Autocomplete Schools
        $('#'+divValue+' .school').autocomplete({
            maxShowItems: 5,
            source: availableSchools,
            minLength: 0,
            scroll: true,
            select: function( event, ui ) {
                // alert("Select Event Triggered");
            },
            open: function(){
                $('.ui-autocomplete').css('width', '546px'); // HERE
            },           
            
            change: function (event, ui) {
                if (ui.item != null) {
                    let splittedText = ui.item.label.split('|');
                    $('#'+divValue+' .school').attr('data-schoolid',splittedText[0]);
                    $('#'+divValue+' .school').val(splittedText[1]);
                    $('#'+divValue+' .school').prop('disabled','disabled');
                }
                else{
                    $('#'+divValue+' .school').val('');
                }
              },
            }).focus(function() {
            $(this).autocomplete("search", "");
          });

    //  Autocomplete Hours
          $('#'+divValue+' .hours').autocomplete({
            maxShowItems: 5,
            source: availableHours,
            minLength: 0,
            scroll: true,
            select: function( event, ui ) {
                // alert("Select Event Triggered");
            },
            }).focus(function() {
            $(this).autocomplete("search", "");
          });
    }
    // Add new Card
    function addCardClick(statusColor) { 
        $('#btn-addTasks').prop('disabled',true);
        addCard(statusColor);
    }
    function addCard(statusColor) {

        //clone the first card
        $('#div0')
        .clone()
        .attr('id', 'div'+cardCount)
        .css('display','block')  
        .insertAfter('#div'+(cardCount-1))
        .fadeIn('slow');
      
        //change the id of card
        $('#div'+cardCount).find('#collapse0')
        .attr('id','collapse'+cardCount)
      
        //change the datatarget of the card body
        $('#div'+cardCount).find('.accordion-button')
        .attr('data-target','#collapse'+cardCount)
      
        //add the class for header color
        $('#div'+cardCount).find('.accordion-button')
        .addClass(statusColor)

        $('#collapse'+cardCount+' .hours').select2(
            {
                dropdownAutoWidth: true
            },
        );

        addSelect('collapse'+cardCount);
        cardCount++;

    }

    function clearCard (ctrl,type) {
       
        let cardCount;
        if (type == 'new') {
            cardCount = ctrl;
        } else {
          cardCount =  "#"+$(ctrl).parent().parent().parent().parent().attr('id'); 
        }
        $( cardCount+' .task').val('');
        $( cardCount+' .task').prop('disabled',false);

        $( cardCount+' .project').val('');
        $( cardCount+' .project').attr('data-projectid','');

        $( cardCount+' .activity').val('');
        $( cardCount+' .activity').prop('disabled',false);
        $( cardCount+' .activity').attr('data-activityid','');

        $( cardCount+' .school').val('');
        $( cardCount+' .school').prop('disabled',false);
        $( cardCount+' .school').attr('data-schoolid','');


        $( cardCount+' .hours').val('0').trigger('change');

        $( cardCount+' .description').val('');
    }

    // function removeCards () {
    //     $('.addedCard').fadeOut();
    //     $('#btn-addRemove').fadeOut('5000');
    // }

/// End Common Function
////////////////////////////////////////////////////////////////////////////////////
    
/// Start Page Load
$("#exampleModalCenter").modal("show");

// Calendar Details in Month AJAX
function displayTimesheet() {
    deleteCard();
    // alert(cardDate);
    // let token = "eyJraWQiOiJITXFsVWhxWE56dWh3dmkrRTI2V2trcGp0VllhckRDSzduT0xvb3cycFdjPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiUUNFSUM4bnhFa3p2T3JUaGFCLVQxUSIsInN1YiI6IjVhNjFjMzhkLWI5ZWYtNDc1MC04ZTgzLTk2ODZhZmViNjE5NyIsImNvZ25pdG86Z3JvdXBzIjpbImV1LWNlbnRyYWwtMV9QVGtaVnpxQ3pfTmlwdXJuYUF6dXJlIl0sImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfUFRrWlZ6cUN6IiwiY29nbml0bzp1c2VybmFtZSI6Im5pcHVybmFhenVyZV92aWduZXNoLmxha3NobWluYXJheWFuYW5AbmlwdXJuYWl0LmNvbSIsImF1ZCI6IjNrY2c5Nzk4cTYxZ3BtNWo3aTdxNjNnZDJvIiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoidmlnbmVzaC5sYWtzaG1pbmFyYXlhbmFuQG5pcHVybmFpdC5jb20iLCJwcm92aWRlck5hbWUiOiJOaXB1cm5hQXp1cmUiLCJwcm92aWRlclR5cGUiOiJTQU1MIiwiaXNzdWVyIjoiaHR0cHM6XC9cL3N0cy53aW5kb3dzLm5ldFwvMWIyNjk1MzctODEyOS00N2FjLWE1MzEtZWJmMzU1MmQzZjFlXC8iLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTY2OTQ0MDc4MDg3NiJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2Njk0Njk3MTksImV4cCI6MTY2OTQ3MzMxOSwiaWF0IjoxNjY5NDY5NzE5LCJqdGkiOiIwOTU1NTEzYi00NjgxLTQ3ZTMtODBhMC1jMGFiMGFkMzkzMTEiLCJlbWFpbCI6InZpZ25lc2gubGFrc2htaW5hcmF5YW5hbkBuaXB1cm5haXQuY29tIn0.kOBaZQzE4AyWPpBgFx-P8z3D1s8c8raZyd_c4_HYCm0UzAQXUQWTCr7Kzh-QdPMBdcGGko2n-4c26PS0JP58MaZqcBtYbw6AMEpuaQgpeaoLmy9aqenRWwBZldywNn1OwFZjJ0tVq9MbKGZNYO4O6PsnZAMpJYQJTejBvWphssgLYmEVIh5YwoCzqPkVHdRT-JnR4nsnop1CKufXKNx-83bwpjnaqOM3qOu4bU8mpWh4VJJ474y_tsSVgLnXYkuaskbYETo3vJFhgqnoqHY4FaHgDLwl2TL__jnxeW_h40kV3RoxUOsXQfWxkNKsx-gNIb9oSqgtDY39yjQbRolCpQ"
    if (!trayObject.includes(firstDay) && !trayObject.includes(cardDate)) {
            $("#exampleModalCenter").modal("show");
            
        $.ajax({
            type:"GET",
            url:`${httpURL}/employeebookedlistcalender?employeeId=${empID}&startDate=${firstDay}&endDate=${lastDay}`,

            // url:`https://lj8f09lng9.execute-api.eu-central-1.amazonaws.com/Prod/employeebookedlist?startDate=${firstDay}&employeeId=${empID}&endDate=${lastDay}`,
            async:false,
            dataType: "json",
            contentType: "application/json;charset=utf-8",

            success: function(successdata) {

                getEvents(successdata.EmployeeBookedCalendarList);
                trayObject.push(firstDay);
    
            },
            error: function (response,error,message) {
                setTimeout(function() {
                    $("#exampleModalCenter").modal("hide");
                }, 1000);
                toastr.error("Error Occurred While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 1000 });
            
            },   
        });

        setTimeout(function() {
            $("#exampleModalCenter").modal("hide");
        }, 1000);
    }

    totalTasks(cardDate);
      
}
// Projecttask List AJAX
$.ajax({
    type: "GET",
    url: httpURL+"/projecttasklist?employeeServiceId="+employeeServiceID,
    dataType: "json",
   
    success: function (response) {

        totalTaskDetails = [...new Map(response.ProjectTaskList.map(item => [item.TaskID, item])).values()];
        availableTasks = totalTaskDetails.map(el => { return el.TaskDetails});

        // taskList.forEach((element) => {
        //     if(element.TaskDetails !="" && element.TaskDetails != "undefined"){
        //         $(".task").append("<option value="+element.ActivityID+">" + element.TaskDetails + "</option>");
        //     }
        // });
    }
});

// School List AJAX
$.ajax({
    type: "GET",
    url: httpURL+"/schoollist",
    dataType: "json",
   
    success: function (response) {
        let list = [...new Map(response.SchoolList.map(item => [item.SchoolID, item])).values()];
        availableSchools = list.map(el => { return el.SchoolDetails});
        // console.log(availableSchools);
    }
});

// Contract List AJAX
$.ajax({
    type: "GET",
    url: `${httpURL}/contractemployeeservices?employeeId=${primaryDetails.EmployeeId}`,
    dataType: "json",
    async:false,
    success: function (res) {
        availableContractList = res.ContractEmployeeServices;
        console.log("Contract lIST",availableContractList);
    },
    error: function(error) {
        toastr.error("Contract ERROR");
    }
});

// Contract List Fetch
// fetch(`${httpURL}/contractemployeeservices?employeeId=${primaryDetails.EmployeeId}`)
// .then(response => response.json())
// .then(res => {
// availableContractList = res.ContractEmployeeServices;
//   console.log("Contract lIST",availableContractList);
// })
// .catch(err => {
//     toastr.error("Error Occurred in While Processing... Please Try Again or Contact Adiministrator",{ timeOut: 1000 });
// });

// }
// Start Calendar Initialization

document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');

     calendar = new FullCalendar.Calendar(calendarEl, {

        plugins: [ 'interaction', 'dayGrid' ],
        height: 550,
        // locale: 'he',
        // dir:'rtl',

        headerToolbar: {
            right  : '',
            center: '',
            left : 'title'
        },
        timeZone: 'IST',
        initialView: 'dayGridMonth',
        selectable: true,
        selectHelper: true,
        
        fixedWeekCount: false,
        unselectAuto: false,
        disableDragging: true,

        eventOrder: true,
        eventClick: function(info) {
           
            let evenDate = new Date(info.event.start);
            let date=evenDate.getFullYear() + '-'+ ((evenDate.getMonth()+1).toString().length==2?(evenDate.getMonth()+1): '0'+(evenDate.getMonth()+1)) +'-'+((evenDate.getDate()).toString().length==2?(evenDate.getDate()): '0'+(evenDate.getDate()));
            
            if (primaryDetails.EmployeeCatagory == 'EC5') {
                deleteCardContract();
                totalTasksContract(cardDate);
            } else {
                deleteCard();
                totalTasks(cardDate);
            }
        },
   
        dateClick: function(info) {
            
            let selectedDate = info.date;
            cardDate = info.dateStr;
            if (primaryDetails.EmployeeCatagory == 'EC5') {
                deleteCardContract();
                totalTasksContract(cardDate);
            } else {
                deleteCard();
                totalTasks(cardDate);
            }
            
        }
   
    });
  
    calendar.render();

    $('.calendar-content').show();

});
// End Calendar Initialization
setTimeout(function() {
    $("#exampleModalCenter").modal("hide");
  }, 2000);

/// End page Load
////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
///Start Prev, Next, Today Calendar Button Action

    // Prev Button handling
    document.getElementById('my-prev-button').addEventListener('click', function() {
                
                calendar.prev();
                if (primaryDetails.EmployeeCatagory == 'EC5') {
                displayCalenderPrevNextContract();
                } else {
                displayCalenderPrevNext();
                }
                
    });

     // Next Button handling
    document.getElementById('my-next-button').addEventListener('click', function() {
    
                calendar.next();
                if (primaryDetails.EmployeeCatagory == 'EC5') {
                    displayCalenderPrevNextContract();
                    } else {
                    displayCalenderPrevNext();
                    }


    });

    // Today Button Handling
    document.getElementById('my-today-button').addEventListener('click', function() {
        calendar.today();
        if (primaryDetails.EmployeeCatagory == 'EC5') {
            deleteCardContract();
            cardDate = new Date().toISOString().slice(0, 10);
            totalTasksContract(cardDate);
            }
             else {
                deleteCard();
                cardDate = new Date().toISOString().slice(0, 10);
                totalTasks(cardDate);
            }
       
    });

    // Prev Next Calendar Data handling
    function displayCalenderPrevNext () {
        $('.taskDate').text('');
        $("#exampleModalCenter").modal("show");
        deleteCard();

        let dateString = $('.fc-left h2').text();
                let d = new Date(dateString);
            //    console.log("DATE",d);
                firstDay = (new Date(d.getFullYear(), d.getMonth(), 2)).toISOString().slice(0,10);
                lastDay = (new Date(d.getFullYear(), d.getMonth() + 1, 1)).toISOString().slice(0,10);

                if (!trayObject.includes(firstDay)) {

                    fetch(`${httpURL}/employeebookedlistcalender?employeeId=${empID}&startDate=${firstDay}&endDate=${lastDay}`)
                    .then(response => response.json())
                    .then(res => {
                        trayObject.push(firstDay);
                        getEvents(res.EmployeeBookedCalendarList);
                    })
                    .catch(err => {
                        toastr.error("Error Occurred in While Processing... Please Try Again or Contact Adiministrator",{ timeOut: 1000 });
                    });
                        
                }

                setTimeout(function() {
                    $("#exampleModalCenter").modal("hide");
                  }, 1000);
    }

///End Prev, Next, Today Calendar Button Action
///////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
/// Start On Calendar Event Click

    // Card Generate    
    function totalTasks(cardDate) { 

        let displayDate = new Date(cardDate).toLocaleString('en-us',{month : 'short'});
        $('.taskDate').text('Total tasks on  '+displayDate+' '+new Date(cardDate).getDate());       

        cardCount=1;
        if (calendar.getEventById(cardDate+'N') || calendar.getEventById(cardDate+'C') || calendar.getEventById(cardDate+'R')) {
            $("#exampleModalCenter").modal("show"); 
            let filteredDetails = [];
            let filteredTaskDetails = [];
    
            fetch(`${httpURL}/employeebookedlist?startDate=${cardDate}&BusinessPartnerId=${internalID}&endDate=${cardDate}`)
            .then(response => response.json())
            .then(data => {
                filteredTaskDetails = data.EmployeeTimeshetList;
    
                filteredDetails = filteredTaskDetails.filter((elA) => elA.Date === cardDate);
    
            
            if (filteredDetails.length != 0) {
              
                $.each(filteredDetails, function (index, value) { 
                    let statusValue = 'bg-secondary';
                    
                    switch (value.Status) {
                        case 'Confirmed':
                            statusValue = 'bg-success';
                            break;
        
                        case 'Rejected':
                            statusValue = 'bg-danger';
                            break;
                    
                        default:
                            statusValue = 'bg-secondary';
                            break;
                    }

                    addCard(statusValue);
                    $('#btn-addTasks').prop('disabled',false);


                        
                            if (value.Status == 'Not Confirmed' || value.Status == 'Rejected') {
                                if (value.Status == 'Rejected') {
                                    $('#collapse'+(cardCount-1)+' .div-rejectedReason').show();
                                    $('#collapse'+(cardCount-1)+' .rejectedReason').val(value.RejectionRemarks);
                                }
                                $('#collapse'+(cardCount-1)+' .btnSubmit').attr('value','Update');
                            }
                            $('#collapse'+(cardCount-1)+' .statusText').text(value.Status);

                            $('#collapse'+(cardCount-1)+' .btnClear').hide();

                            if ((value.TaskName == '') || (value.ProjectName == '')) {
                                $( '#div'+(cardCount-1)+' .cardHeader').text(value.ActivityName);
                            }
                            else
                            {
                            $( '#div'+(cardCount-1)+' .cardHeader').text(value.ProjectName);
                            }

                            if (value.Hours != "") {
                                if(value.Hours.substring(2,value.Hours.length-1).length<3)
                                {
                                    $( '#div'+(cardCount-1)+' .cardDate').text(" (00:"+value.Hours.substring(2,value.Hours.length-1)+")")
                                }
                                else{
                                    let trimmedHours = (value.Hours).substring(2,(value.Hours).length-1).split('H');

                                    $( '#div'+(cardCount-1)+' .cardDate').text("  ("+(trimmedHours[0].length == 2 ? trimmedHours[0] : '0'+ trimmedHours[0])+':'+ (trimmedHours[1].length == 2 ? trimmedHours[1] : '0'+ trimmedHours[1])+")");        
                                }
                     
                        }

                            $( '#collapse'+(cardCount-1)+' .cardDate').text("  ("+(value.Hours).substring(2,(value.Hours).length-1).replace('H',":")+")");
        
                            $( '#collapse'+(cardCount-1)+' .task').val(value.TaskName);
                            $( '#collapse'+(cardCount-1)+' .task').attr('data-taskid',value.TaskID);
                            $( '#collapse'+(cardCount-1)+' .task').attr('data-timeuuid',value.EmployeeTimeUUID);
                            $( '#collapse'+(cardCount-1)+' .task').attr('data-itemuuid',value.EmployeeItemUUID);
                            $( '#collapse'+(cardCount-1)+' .task').attr('data-timeagreementuuid',value.EmployeeTimeagreementUUID);
                            $( '#collapse'+(cardCount-1)+' .task').attr('data-timetextuuid',value.EmployeeTimeTextUUID);
    
                            employeeTimeagreementUUID = value.EmployeeTimeagreementUUID;
        
                            $( '#collapse'+(cardCount-1)+' .project').val(value.ProjectName);
                            $( '#collapse'+(cardCount-1)+' .project').attr('data-projectid',value.ProjectID);
        
                            $( '#collapse'+(cardCount-1)+' .activity').val(value.ActivityName);
                            $( '#collapse'+(cardCount-1)+' .activity').attr('data-activityid',value.ActivityID);
        
                            $( '#collapse'+(cardCount-1)+' .school').val(value.SchoolDescription);
                            $( '#collapse'+(cardCount-1)+' .school').attr('data-schoolid',value.SchoolID);
        
                            $( '#collapse'+(cardCount-1)+' .description').val(value.Description);

                            if (value.Hours != "") {
                                if(value.Hours.substring(2,value.Hours.length-1).length<3)
                                {
                                    $( '#div'+(cardCount-1)+' .hours').val("00:"+value.Hours.substring(2,value.Hours.length-1)).trigger('change');

                                }
                                else{
                                    let trimmedHours = (value.Hours).substring(2,(value.Hours).length-1).split('H');

                                    $('#div'+(cardCount-1)+' .hours').val((trimmedHours[0].length == 2 ? trimmedHours[0] : '0'+ trimmedHours[0])+':'+ (trimmedHours[1].length == 2 ? trimmedHours[1] : '0'+ trimmedHours[1])).trigger('change');
       
                                }

                            }
                          
                            $('#collapse'+(cardCount-1)+' .task').prop('disabled', true);
                            $('#collapse'+(cardCount-1)+' .activity').prop('disabled', true);
                            $('#collapse'+(cardCount-1)+' .school').prop('disabled', true);    
                        
                            if (value.Status == 'Confirmed') {
                                
                                $('#collapse'+(cardCount-1)+' .description').prop('disabled', true);
                                $('#collapse'+(cardCount-1)+' .hours').prop('disabled', true);
                                $('#collapse'+(cardCount-1)+' .btnSubmit').hide();
                                
                            }
                 
                });
        
            } 
            else {
                $('#btn-addTasks').prop('disabled',true);
                addCard('bg-secondary');
            }
    
            })
            .catch(err => {
                setTimeout(function() {
                  $("#exampleModalCenter").modal("hide");
              }, 1000);
                toastr.error("Error Occurred in While Processing... Please Try Again or Contact Adiministrator",{ timeOut: 1000 });
             });
      
            
            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);
            
        }
        else {
            $('#btn-addTasks').prop('disabled',true);
            addCard('bg-secondary');
        }
        
    }

    // Save Update operation
    function modifyTimesheet(event) {  
           
        let allowSave=false;
       
        let cardId = $(event).parent().parent().parent().parent().attr('id');
        hoursStatus = event.value;
        if($('#'+cardId+' .task').val() =='' && $('#'+cardId+' .activity').val() != ''){
            allowSave=true;
        }
        else if (primaryDetails.SchoolMandartory == false && $('#'+cardId+' .activity').val() != '' && 
        $('#'+cardId+' .task').val() !='') {
                allowSave=true;
            
        } else if (primaryDetails.SchoolMandartory == true && $('#'+cardId+' .school').val() != '' 
        && $('#'+cardId+' .activity').val() != '' && 
        $('#'+cardId+' .task').val() !=''){
            allowSave=true;
        }
        else
        {
            allowSave=false;
        }

        if (allowSave &&  $('#'+cardId+' .hours').val() !='' && $('#'+cardId+' .description').val() != '') {      
            if (hoursStatus == 'Update') {                           

                $("#exampleModalCenter").modal("show");

                    updateData = {
                        EmployeeItemUUID: $('#'+cardId+' .task').attr("data-itemuuid"),
                        EmployeeTimeTextUUID:$('#'+cardId+' .task').attr("data-timetextuuid"),
                        Date: cardDate,
                        TaskID: $('#'+cardId+' .task').attr("data-taskid"),
                        TaskName: $('#'+cardId+' .task').attr("data-taskid"),
                        ProjectID: $('#'+cardId+' .project').attr("data-projectid"),
                        ProjectName: $('#'+cardId+' .project').val(),
                        ActivityID: $('#'+cardId+' .activity').attr("data-activityid"),
                        ActivityName: $('#'+cardId+' .activity').val(),
                        Description:$('#'+cardId+' .description').val(),
                        RejectionRemarks: "",
                        SchoolID: $('#'+cardId+' .school').attr("data-schoolid"),
                        SchoolDescription: $('#'+cardId+' .school').val(),
                        Hours: "PT"+$('#'+cardId+' .hours').val().replace(":","H")+"M",
                        Operation: "Update"
                    }

                    // console.log("object",JSON.stringify(updateData));
                
                    // Update Booking

                    fetch(`${httpURL}/employeebookedlist`,{
                        method: 'POST',
                        body: JSON.stringify(updateData),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        let headerNameId = cardId.substring(8);
                        if (data.TimesheetUpdate.ProjectName == "") {
                            $('#div'+headerNameId+' .cardHeader').text(data.TimesheetUpdate.ActivityName);
                        }   
                        else{
                            $('#div'+headerNameId+' .cardHeader').text(data.TimesheetUpdate.ProjectName);
                        }

                        $('#div'+headerNameId+' .cardDate').text("  ("+(data.TimesheetUpdate.Hours).substring(2,(data.TimesheetUpdate.Hours).length-1).replace('H',":")+")");
                        $('#'+cardId+' .hours').val("("+(data.TimesheetUpdate.Hours).substring(2,(data.TimesheetUpdate.Hours).length-1).replace('H',":")+")");

                        $('#'+cardId+' .task').attr("data-timeuuid",data.TimesheetUpdate.EmployeeTimeUUID);
                        $('#'+cardId+' .task').attr("data-itemuuid",data.TimesheetUpdate.EmployeeItemUUID);
                        $('#'+cardId).removeClass('card-danger').addClass('card-secondary');
                        
                        $('#div'+headerNameId+' .accordion-button').removeClass('collpased');
                        $('#'+cardId).removeClass('show');

                        $('#'+cardId+' .btnClear').hide();

                        appendToCalender();
                        toastr.success("Timesheet updated Successfully.","Done!");
                        setTimeout(function() {
                            $("#exampleModalCenter").modal("hide");
                        }, 1000);
                })
                    .catch(err => {
                        setTimeout(function() {
                            $("#exampleModalCenter").modal("hide");
                        }, 1000);
                        toastr.error("Error Occurred in While Processing... Please Try Again or Contact Adiministrator",{ timeOut: 1000 });
                    });


                }
                else {  
                $("#exampleModalCenter").modal("show");

                    createData = {
                        EmployeeTimeagreementUUID: employeeTimeagreementUUID,
                        Date: cardDate,
                        TaskID: $('#'+cardId+' .task').attr("data-taskid"),
                        TaskName: $('#'+cardId+' .task').val(),
                        ProjectID:  $('#'+cardId+' .project').attr("data-projectid"),
                        ProjectName:  $('#'+cardId+' .project').val(),
                        ActivityID: $('#'+cardId+' .activity').attr("data-activityid"),
                        ActivityName: $('#'+cardId+' .activity').val(),
                        Description:$('#'+cardId+' .description').val(),
                        RejectionRemarks: "",
                        Hours: "PT"+$('#'+cardId+' .hours').val().replace(":","H")+"M",
                        SchoolID: $('#'+cardId+' .school').attr("data-schoolid"),
                        SchoolDescription: $('#'+cardId+' .school').val(),
                        Operation: "Create"
                    }
                    
                    fetch(`${httpURL}/employeebookedlist`,{
                        method: 'POST',
                        body: JSON.stringify(createData),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    })
                    .then(response => response.json())
                    .then(response => {
                        let headerNameId = cardId.substring(8);
                        $('#btn-addTasks').prop('disabled',false);

                        if (response.TimesheetCreate.ProjectName == "") {
                            $('#div'+headerNameId+' .cardHeader').text(response.TimesheetCreate.ActivityName);
                        }   
                        else{
                            $('#div'+headerNameId+' .cardHeader').text(response.TimesheetCreate.ProjectName);
                        }
                            $('#div'+headerNameId+' .cardDate').text("  ("+(response.TimesheetCreate.Hours).substring(2,(response.TimesheetCreate.Hours).length-1).replace('H',":")+")");
                           
                            $('#'+cardId+' .hours').val((response.TimesheetCreate.Hours).substring(2,(response.TimesheetCreate.Hours).length-1).replace('H',":"));
                            
                            $('#'+cardId+' .task').attr('disabled','disabled');
                            $('#'+cardId+' .school').attr('disabled','disabled');
                            $('#'+cardId+' .activity').attr('disabled','disabled');
                            $('#'+cardId+' .task').attr("data-timeuuid",response.TimesheetCreate.EmployeeTimeUUID);
                            $('#'+cardId+' .task').attr("data-itemuuid",response.TimesheetCreate.EmployeeItemUUID);
                            $('#'+cardId+' .task').attr("data-timetextuuid",response.TimesheetCreate.EmployeeTimeTextUUID);
                            
                            $('#div'+headerNameId+' .accordion-button').removeClass('collpased');
                            $('#'+cardId).removeClass('show');

                            $('#'+cardId+' .btnSubmit').val("Update");
                            $('#'+cardId+' .btnClear').hide();

                            toastr.success("Timesheet Booked Successfully.","Done!");

                            appendToCalender();

                            setTimeout(function() {
                                $("#exampleModalCenter").modal("hide");
                            }, 1000);
                    })
                    .catch(err => {
                        setTimeout(function() {
                            $("#exampleModalCenter").modal("hide");
                        }, 1000);
                        toastr.error("Error Occurred in While Processing... Please Try Again or Contact Adiministrator",{ timeOut: 1000 });
                    });


                }

            } 
            else {
  
                if($('#'+cardId+' .task').val() =='' && $('#'+cardId+' .activity').val() != ''){

                toastr.error("Please fill Hours, description fields.");                    
                }

                else if(primaryDetails.SchoolMandartory) {
                toastr.error("Please fill Tasks,School, Hours, Description fields.");
                }
                else if(!primaryDetails.SchoolMandartory){
                    toastr.error("Please fill Tasks, Hours, Description fields.");
                }


            }
           
    }
    // Calendar Event Update
    function appendToCalender() {   
        let newDetails = [];

        fetch(`${httpURL}/employeebookedlistcalender?employeeId=${empID}&startDate=${cardDate}&endDate=${cardDate}`)
        .then(response => response.json())
        .then(res => {
            newDetails = res.EmployeeBookedCalendarList;
            let event, hourBooked;

        ///Not Confirmed Event Generate
        event = calendar.getEventById(newDetails[0].Date+'N');

        if (event) {
            event.remove();
            // hourBooked=parseFloat(newDetails[0].NotConfirmedHrs);
            // event.setProp('title', parseInt(hourBooked) +':'+((hourBooked - Math.floor(hourBooked))*60).toString().split('.')[0]);  
        }

        event = calendar.getEventById(newDetails[0].Date+'C');

        if (event) {
            event.remove();
        }

        event = calendar.getEventById(newDetails[0].Date+'R');

        if (event) {
            event.remove();
        }
        //else{
            hourBooked=parseFloat(newDetails[0].NotConfirmedHrs);
            
            if(hourBooked>0)
            {
                calendar.addEvent({
                    'id' : newDetails[0].Date+'N',
                    start: newDetails[0].Date,
                    title: parseInt(hourBooked) +':'+((hourBooked - Math.floor(hourBooked))*60).toString().split('.')[0],// calendarEvents[i].NotConfirmedHrs.substring(0,4)+'H',
                    color : "white",
                    textColor: "#6C757D",
                });
            }
            hourBooked=parseFloat(newDetails[0].ConfirmedHrs);
            if(hourBooked>0)
            {
                
                calendar.addEvent({
                    'id' : newDetails[0].Date+'C',
                    start: newDetails[0].Date,
                    title:  parseInt(hourBooked) +':'+((hourBooked - Math.floor(hourBooked))*60).toString().split('.')[0],//calendarEvents[i].ConfirmedHrs.substring(0,4)+'H',
                    color : "white",
                    textColor: "green",
                });
            }
            hourBooked=parseFloat(newDetails[0].RejectedHrs);
            if(hourBooked>0)
            {            
                calendar.addEvent({
                    'id' : newDetails[0].Date+'R',
                    start: newDetails[0].Date,
                    title:  parseInt(hourBooked) +':'+((hourBooked - Math.floor(hourBooked))*60).toString().split('.')[0],//calendarEvents[i].RejectedHrs.substring(0,4)+'H',
                    color : "white",
                    textColor: "red",
                });
            }

            
        
        
        // Confirmed Event Generate
        // event = calendar.getEventById(newDetails[0].Date+'C');
            // if (event) {
            //     calendar.addEvent({
            //         'id' : newDetails[0].Date+'C',
            //         start: newDetails[0].Date,
            //         title: newDetails[0].ConfirmedHrs.substring(0,4)+'H',
            //         color : "white",
            //         textColor: "green",
            //     });
            // }
            // else{
            //     event.setProp('title',newDetails[0].ConfirmedHrs.substring(0,4)+'H');                
            // }

        //Rejected Event Generate
        // event = calendar.getEventById(newDetails[0].Date+'R');
            // if (event) {
            //     calendar.addEvent({
            //         'id' : newDetails[0].Date+'R',
            //         start: newDetails[0].Date,
            //         title: newDetails[0].RejectedHrs.substring(0,4)+'H',
            //         color : "white",
            //         textColor: "red",
            //     });
            
            // }
            // else{
            //     event.setProp('title',newDetails[0].RejectedHrs.substring(0,4)+'H');
            // }

        })
        .catch(err => {
            toastr.error("Error Occurred in While Processing... Please Try Again or Contact Adiministrator",{ timeOut: 1000 });
        });

      
        
    }

/// End On Calendar Event Click
//////////////////////////////////////////////////////////////////////////////////
