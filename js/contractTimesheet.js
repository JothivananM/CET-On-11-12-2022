////////////////////////////////////////////////////////////////////////////////////
///Start Common Function

    // Delete Previous Cards
    function deleteCardContract() {
        for (let index = 1; index <= cardCount; index++) {
            $('#Cdiv'+index).remove();
        }
        cardCount=1;
    }
    
    // Generate Calendar Events
    function getEventsContract (employeeTimesheetList) {
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
    function addSelectContract(divValue) {  

        // let taskFilter = [];
        // $('#'+divValue+' .task').autocomplete({
        //     source: availableTasks,
        //     minLength: 0,
        //     maxShowItems: 5,
        //     scroll: true,
        //     open: function(){
        //         $('.ui-autocomplete').css('width', '546px'); // HERE
        //     },
            
        //     select: function( event, ui ) {
          
        //         let separatedDetails = ui.item.label;

        //         taskFilter = totalTaskDetails.filter(el => {
        //             return el.TaskDetails == separatedDetails;
        //         });
        //         $('#'+divValue+' .project').attr('data-projectid',taskFilter[0].ProjectId);
        //         $('#'+divValue+' .project').val(taskFilter[0].ProjectName);

        //         $('#'+divValue+' .activity').attr('data-activityid',taskFilter[0].ActivityID);
        //         $('#'+divValue+' .activity').val(taskFilter[0].ActivityName);  
                
        //         $('#'+divValue+' .activity').prop('disabled','disabled')

        //     },
        //     // open: function(){
        //     //     $('.ui-autocomplete').css('width', '300px'); // HERE
        //     // },
        //     change: function (event, ui) {
        //         $('#'+divValue+' .task').val(taskFilter[0].TaskName);
        //         $('#'+divValue+' .task').attr('data-taskid',taskFilter[0].TaskID);
        //         $('#'+divValue+' .task').prop('disabled','disabled');
        //       },
        // }).focus(function() {
        //     $(this).autocomplete("search", "");
        // });

        // // Autocomplete Activity
        // $( '#'+divValue+' .activity').autocomplete({
        //     maxShowItems: 5,
        //     source: availableActivities,
        //     minLength: 0,
        //     scroll: true,
        //     select: function( event, ui ) {
        //         // alert("Select Event Triggered");
        //     },
        //     change: function (event, ui) {
               
        //         $('#'+divValue+' .activity').prop('disabled','disabled');
        //       }
          
        //     }).focus(function() {
        //     $(this).autocomplete("search", "");
        //   });

    // Autocomplete Contract
    $('#'+divValue+' .contract').autocomplete({
        maxShowItems: 5,
        source: contractList,
        minLength: 0,
        scroll: true,
        select: function( event, ui ) {
            if (ui.item != null) {
                let splittedText = ui.item.label.split(' | ');

                let plannedQuantity = availableContractList.filter((el) => el.ContractID == splittedText[1]);

                $('#'+divValue+' .plannedHours').val(plannedQuantity[0].PlannedQuantity.substring(0,6));
                $('#'+divValue+' .service').attr('data-serviceid',plannedQuantity[0].ServiceID);
                $('#'+divValue+' .contract').attr('data-taskid',plannedQuantity[0].ProjectTaskID);
                $('#'+divValue+' .contract').attr('data-taskname',plannedQuantity[0].ProjectTaskName);

                $('#'+divValue+' .contract').attr('data-contractid',splittedText[1]);
                $('#'+divValue+' .contract').val(splittedText[2] + " | " + splittedText[1]);
                $('#'+divValue+' .service').val(splittedText[0]);
                $('#'+divValue+' .contract').prop('disabled','disabled');
                // $('#'+divValue+' .plannedHours').val(splittedText[0]);
            }
            else{
                $('#'+divValue+' .contract').val('');
            }
            
        },
        open: function(){
            $('.ui-autocomplete').css('width', '546px'); // HERE
        },           
        
        change: function (event, ui) {
           
          },
        }).focus(function() {
        $(this).autocomplete("search", "");
      });
        
    //    Autocomplete Schools
        $('#'+divValue+' .schoolContract').autocomplete({
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
                    $('#'+divValue+' .schoolContract').attr('data-schoolid',splittedText[0]);
                    $('#'+divValue+' .schoolContract').val(splittedText[1]);
                    $('#'+divValue+' .schoolContract').prop('disabled','disabled');
                }
                else{
                    $('#'+divValue+' .schoolContract').val('');
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

    function addCardClickContract(statusColor) {
        $('#btn-bookTimeContract').prop('disabled',true);
        addCardContract(statusColor);
    }
    function addCardContract(statusColor) {
        //clone the first card
        $('#Cdiv0')
        .clone()
        .attr('id', 'Cdiv'+cardCount)
        .css('display','block')  
        .insertAfter('#Cdiv'+(cardCount-1))
        .fadeIn('slow');
      
        //change the id of card
        $('#Cdiv'+cardCount).find('#Ccollapse0')
        .attr('id','Ccollapse'+cardCount)
      
        //change the datatarget of the card body
        $('#Cdiv'+cardCount).find('.accordion-button')
        .attr('data-target','#Ccollapse'+cardCount)
      
        //add the class for header color
        $('#Cdiv'+cardCount).find('.accordion-button')
        .addClass(statusColor)

        $('#Ccollapse'+cardCount+' .hours').select2(
            {
                dropdownAutoWidth: true
            },
        );

        addSelectContract('Ccollapse'+cardCount);
        cardCount++;

    }

    function clearCardContract (ctrl,type) {
       
        let cardCount;
        if (type == 'new') {
            cardCount = ctrl;
        } else {
          cardCount =  "#"+$(ctrl).parent().parent().parent().parent().attr('id'); 
        }
      
        $( cardCount+' .contract').val('');
        $( cardCount+' .contract').prop('disabled',false);
        $( cardCount+' .contract').attr('data-contractid','');

        $( cardCount+' .service').val('');
        $( cardCount+' .service').attr('data-serviceid','');

        $( cardCount+' .plannedHours').val('');
        $( cardCount+' .reportedHours').val('');

        $( cardCount+' .startTime').val('');
        $( cardCount+' .endTime').val('');
        $( cardCount+' .workedHours').val('');

        $( cardCount+' .travelby').val('0');
        $( cardCount+' .kmOrAmt').val('');
        $( cardCount+' .description').val('');

        $( cardCount+' .schoolContract').val('');
        $( cardCount+' .schoolContract').prop('disabled',false);
        $( cardCount+' .schoolContract').attr('data-schoolid','');

    }

/// End Common Function
////////////////////////////////////////////////////////////////////////////////////
    
/// Start Page Load
$("#exampleModalCenter").modal("show");

// Calendar Details in Month AJAX
function displayTimesheetContract() {
    deleteCardContract();
    // let token = "eyJraWQiOiJITXFsVWhxWE56dWh3dmkrRTI2V2trcGp0VllhckRDSzduT0xvb3cycFdjPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiUUNFSUM4bnhFa3p2T3JUaGFCLVQxUSIsInN1YiI6IjVhNjFjMzhkLWI5ZWYtNDc1MC04ZTgzLTk2ODZhZmViNjE5NyIsImNvZ25pdG86Z3JvdXBzIjpbImV1LWNlbnRyYWwtMV9QVGtaVnpxQ3pfTmlwdXJuYUF6dXJlIl0sImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfUFRrWlZ6cUN6IiwiY29nbml0bzp1c2VybmFtZSI6Im5pcHVybmFhenVyZV92aWduZXNoLmxha3NobWluYXJheWFuYW5AbmlwdXJuYWl0LmNvbSIsImF1ZCI6IjNrY2c5Nzk4cTYxZ3BtNWo3aTdxNjNnZDJvIiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoidmlnbmVzaC5sYWtzaG1pbmFyYXlhbmFuQG5pcHVybmFpdC5jb20iLCJwcm92aWRlck5hbWUiOiJOaXB1cm5hQXp1cmUiLCJwcm92aWRlclR5cGUiOiJTQU1MIiwiaXNzdWVyIjoiaHR0cHM6XC9cL3N0cy53aW5kb3dzLm5ldFwvMWIyNjk1MzctODEyOS00N2FjLWE1MzEtZWJmMzU1MmQzZjFlXC8iLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTY2OTQ0MDc4MDg3NiJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2Njk0Njk3MTksImV4cCI6MTY2OTQ3MzMxOSwiaWF0IjoxNjY5NDY5NzE5LCJqdGkiOiIwOTU1NTEzYi00NjgxLTQ3ZTMtODBhMC1jMGFiMGFkMzkzMTEiLCJlbWFpbCI6InZpZ25lc2gubGFrc2htaW5hcmF5YW5hbkBuaXB1cm5haXQuY29tIn0.kOBaZQzE4AyWPpBgFx-P8z3D1s8c8raZyd_c4_HYCm0UzAQXUQWTCr7Kzh-QdPMBdcGGko2n-4c26PS0JP58MaZqcBtYbw6AMEpuaQgpeaoLmy9aqenRWwBZldywNn1OwFZjJ0tVq9MbKGZNYO4O6PsnZAMpJYQJTejBvWphssgLYmEVIh5YwoCzqPkVHdRT-JnR4nsnop1CKufXKNx-83bwpjnaqOM3qOu4bU8mpWh4VJJ474y_tsSVgLnXYkuaskbYETo3vJFhgqnoqHY4FaHgDLwl2TL__jnxeW_h40kV3RoxUOsXQfWxkNKsx-gNIb9oSqgtDY39yjQbRolCpQ"
    if (!trayObject.includes(firstDay) && !trayObject.includes(cardDate)) {
            $("#exampleModalCenter").modal("show");
            
        $.ajax({
            type:"GET",
            // url:`${httpURL}/contractemployeetimesheetreportedhours?employeeId=${primaryDetails.EmployeeId}&startDate=${firstDay}&endDate=${lastDay}`,
            url:`${httpURL}/contractemployeetimesheetreportedhours?employeeId=100101&startDate=${firstDay}&endDate=${lastDay}`,

            // url:`https://r9mjde4m5j.execute-api.eu-central-1.amazonaws.com/mock/contractemployeetimesheetreportedhours?employeeId=${empID}&startDate=${firstDay}&endDate=${lastDay}`,

            // url:`https://lj8f09lng9.execute-api.eu-central-1.amazonaws.com/Prod/employeebookedlist?startDate=${firstDay}&employeeId=${empID}&endDate=${lastDay}`,
            async:false,
            dataType: "json",
            contentType: "application/json;charset=utf-8",

            success: function(successdata) {
                getEventsContract(successdata.ContractEmployeeReportedHours);
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

        // $.ajax({
        //     type: "GET",
        //     url: `${httpURL}/contractemployeeservices?employeeId=${primaryDetails.EmployeeId}`,
        //     dataType: "json",
        //     async:false,
        //     success: function (res) {
        //         availableContractList = res.ContractEmployeeServices;
        //     },
        //     error: function(error) {
        //         toastr.error("Contract ERROR");
        //     }
        // });

    totalTasksContract(cardDate);
      
}


// // School List AJAX
// $.ajax({
//     type: "GET",
//     url: httpURL+"/schoollist",
//     dataType: "json",
   
//     success: function (response) {
//         let list = [...new Map(response.SchoolList.map(item => [item.SchoolID, item])).values()];
//         availableSchools = list.map(el => { return el.SchoolDetails});
//     }
// });

setTimeout(function() {
    $("#exampleModalCenter").modal("hide");
  }, 2000);

/// End page Load
////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
///Start Prev, Next, Today Calendar Button Action

    // Prev Next Calendar Data handling
    function displayCalenderPrevNextContract () {
        $('.taskDate').text('');
        $("#exampleModalCenter").modal("show");
        deleteCardContract();

        let dateString = $('.fc-left h2').text();
                let d = new Date(dateString);
                firstDay = (new Date(d.getFullYear(), d.getMonth(), 2)).toISOString().slice(0,10);
                lastDay = (new Date(d.getFullYear(), d.getMonth() + 1, 1)).toISOString().slice(0,10);

                if (!trayObject.includes(firstDay)) {

                    // fetch(`${httpURL}/employeebookedlistcalender?employeeId=${empID}&startDate=${firstDay}&endDate=${lastDay}`)
                    fetch(`https://r9mjde4m5j.execute-api.eu-central-1.amazonaws.com/mock/contractemployeetimesheetreportedhours?employeeId=${empID}&startDate=${firstDay}&endDate=${lastDay}`)
                    .then(response => response.json())
                    .then(res => {
                        trayObject.push(firstDay);
                        getEventsContract(res.ContractEmployeeReportedHours);
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
    function totalTasksContract(cardDate) { 

        let displayDate = new Date(cardDate).toLocaleString('en-us',{month : 'short'});
        $('.taskDate').text('Total tasks on  '+displayDate+' '+new Date(cardDate).getDate());   

        cardCount=1;

        let clickedDate = new Date(cardDate);
        
        let i = 0;

        $.each(availableContractList, function (indexInArray, valueOfElement) { 
                let startDate = new Date(availableContractList[indexInArray].StartDate);
                let endDate = new Date(availableContractList[indexInArray].EndDate);

                if (clickedDate  >= startDate && clickedDate <= endDate) {
                    contractList[i] = availableContractList[indexInArray].ContractServiceList;
                    i++;
                }

        });
     

        if (calendar.getEventById(cardDate+'N') || calendar.getEventById(cardDate+'C') || calendar.getEventById(cardDate+'R')) {

            // $("#exampleModalCenter").modal("show"); 
            let filteredDetails = [];
            let filteredTaskDetails = [];
    
            fetch(`${httpURL}/contractemployeetimesheetlist?employeeId=100101&date=${cardDate}`)
            // fetch(`https://r9mjde4m5j.execute-api.eu-central-1.amazonaws.com/mock/contractemployeetimesheetlistcalendar?employeeId=${empID}&date=${cardDate}`)
           .then(response => response.json())
            .then(data => {
                filteredTaskDetails = data.ContractEmployeeTimesheetDetails;
    
                filteredDetails = filteredTaskDetails.filter((elA) => elA.DateOfBooking === cardDate);
    
            
            if (filteredDetails.length != 0) {
              
                $.each(filteredDetails, function (index, value) { 
                    let statusValue = 'bg-secondary';
                    
                    switch (value.ApprovalStatus) {
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
                    

                    addCardContract(statusValue);
                    $('#btn-bookTimeContract').prop('disabled',false);
                            
                            $( '#Ccollapse'+(cardCount-1)+' .contract').prop('disabled',true);
                            $( '#Ccollapse'+(cardCount-1)+' .school').prop('disabled',true);
                            $('#Ccollapse'+(cardCount-1)+' .btnClearContract').hide();
                            $('#Ccollapse'+(cardCount-1)+' .btnSubmitContract').val('Update');
                        
                            if (value.LifecycleStatus == 'Released') {

                              $( '#Ccollapse'+(cardCount-1)+' .startTime').prop('disabled',true);
                              $( '#Ccollapse'+(cardCount-1)+' .endTime').prop('disabled',true);

                              $( '#Ccollapse'+(cardCount-1)+' .travelby').prop('disabled',true);
                              $( '#Ccollapse'+(cardCount-1)+' .kmOrAmt').prop('disabled',true);

                              $( '#Ccollapse'+(cardCount-1)+' .description').prop('disabled',true);

                              $('#Ccollapse'+(cardCount-1)+' .btnSubmitContract').hide();
                              $('#Ccollapse'+(cardCount-1)+' .btnReleaseContract').hide();
                            }
                            else if(value.LifecycleStatus == 'Not Released') {

                              $( '#Ccollapse'+(cardCount-1)+' .startTime').prop('disabled',false);
                              $( '#Ccollapse'+(cardCount-1)+' .endTime').prop('disabled',false);

                              $( '#Ccollapse'+(cardCount-1)+' .travelby').prop('disabled',false);
                              $( '#Ccollapse'+(cardCount-1)+' .kmOrAmt').prop('disabled',false);

                              $( '#Ccollapse'+(cardCount-1)+' .description').prop('disabled',false);

                              $('#Ccollapse'+(cardCount-1)+' .btnSubmitContract').show();
                              $('#Ccollapse'+(cardCount-1)+' .btnReleaseContract').show();
                            }

                            $('#Ccollapse'+(cardCount-1)+' .statusTextContract').text(value.ApprovalStatus);
                            $( '#Cdiv'+(cardCount-1)+' .cardHeaderContract').text(value.ProjectTaskName);
                            
                            $( '#Cdiv'+(cardCount-1)+' .cardDateContract').text(((value.StartTime).substring(2,(value.StartTime).length-1).replace("H",":")).replace("M",":")
                                        +"-"+((value.EndTime).substring(2,(value.EndTime).length-1).replace("H",":")).replace("M",":"));

                            // if (value.Hours != "") {
                            //     if(value.Hours.substring(2,value.Hours.length-1).length<3)
                            //     {
                            //         $( '#div'+(cardCount-1)+' .cardDate').text(" (00:"+value.Hours.substring(2,value.Hours.length-1)+")")
                            //     }
                            //     else{
                            //         let trimmedHours = (value.Hours).substring(2,(value.Hours).length-1).split('H');

                            //         $( '#div'+(cardCount-1)+' .cardDate').text("  ("+(trimmedHours[0].length == 2 ? trimmedHours[0] : '0'+ trimmedHours[0])+':'+ (trimmedHours[1].length == 2 ? trimmedHours[1] : '0'+ trimmedHours[1])+")");        
                            //     }
                     
                            // }

                            // $( '#collapse'+(cardCount-1)+' .cardDate').text("  ("+(value.Hours).substring(2,(value.Hours).length-1).replace('H',":")+")");
        
                            $( '#Ccollapse'+(cardCount-1)+' .contract').val(value.ContractDescription);
                            $( '#Ccollapse'+(cardCount-1)+' .contract').attr('data-contractid',value.ContractId);
                            $( '#Ccollapse'+(cardCount-1)+' .contract').attr('data-employeeid',value.EmployeeID);
                            $( '#Ccollapse'+(cardCount-1)+' .contract').attr('data-employeename',value.EmployeeName);
                            $( '#Ccollapse'+(cardCount-1)+' .contract').attr('data-taskid',value.ProjectTaskId);
                            $( '#Ccollapse'+(cardCount-1)+' .contract').attr('data-taskname',value.ProjectTaskName);
                            $( '#Ccollapse'+(cardCount-1)+' .contract').attr('data-objectuuid',value.ObjectUUID);

                            
                            $( '#Ccollapse'+(cardCount-1)+' .service').attr('data-serviceid',value.ServiceId);
                            $( '#Ccollapse'+(cardCount-1)+' .service').val(value.ServiceDescription);

                            $( '#Ccollapse'+(cardCount-1)+' .school').attr('data-schoolid',value.SchoolID);
                            $( '#Ccollapse'+(cardCount-1)+' .school').val(value.SchoolDescription);

                            $( '#Ccollapse'+(cardCount-1)+' .plannedHours').val(value.Hours.substring(0,3));
                            $('#Ccollapse'+(cardCount-1)+' .workedHours').val(value.CalculatedHours.substring(0,3));

                            // if(value.CalculatedHours.substring(2,value.CalculatedHours.length-1).length<3)
                            // {
                            //     $('#Ccollapse'+(cardCount-1)+' .reportedHours').val("00:"+value.CalculatedHours.substring(2,value.CalculatedHours.length-1));
                            // }
                            // else{
                            //     let trimmedHours = (value.CalculatedHours).substring(2,(value.CalculatedHours).length-1).split('H');

                            //     $('#Ccollapse'+(cardCount-1)+' .reportedHours').val((trimmedHours[0].length == 2 ? trimmedHours[0] : '0'+ trimmedHours[0])+':'+ (trimmedHours[1].length == 2 ? trimmedHours[1] : '0'+ trimmedHours[1]));        
                            // }


                            $( '#Ccollapse'+(cardCount-1)+' .startTime').val(((value.StartTime).substring(2,(value.StartTime).length-1).replace("H",":")).replace("M",":"));
                            $( '#Ccollapse'+(cardCount-1)+' .endTime').val(((value.EndTime).substring(2,(value.EndTime).length-1).replace("H",":")).replace("M",":"));
                            
                           
                            $( '#Ccollapse'+(cardCount-1)+' .description').val(value.Timesheetcomment);

                            if (value.TravellingBy == "PublicTransport") {
                              $( '#Ccollapse'+(cardCount-1)+' .travelby').val("PublicTransport");
                              $( '#Ccollapse'+(cardCount-1)+' .kmOrAmt').val(value.PublicTransportAmount+'₪');
                            }
                            else{
                              $( '#Ccollapse'+(cardCount-1)+' .travelby').val("CAR");
                              $( '#Ccollapse'+(cardCount-1)+' .kmOrAmt').val(value.TotalKMPerDay.substring(0,3)+'Km');
                            }
                            if (value.ApprovalStatus == 'Rejected') {
                              $('#Ccollapse'+(cardCount-1)+' .div-rejectedReason').show();
                              $('#Ccollapse'+(cardCount-1)+' .rejectedReason').val(value.RejectionRemarks);
                             }

                });
        
            } 
            else {
                $('#btn-bookTimeContract').prop('disabled',true);
                addCardContract('bg-secondary');
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
            $('#btn-bookTimeContract').prop('disabled',true);
            addCardContract('bg-secondary');
        }
        
    }

    function selectKmOrAmt(event) {
      
        if (event.value == 'PublicTransport') {
            $(".kmOrAmt").attr("placeholder", "");
            $(".kmOrAmt").attr("placeholder", "Enter Amount");
        } 
        else if(event.value == 'Car') {
            $(".kmOrAmt").attr("placeholder", "");
            $(".kmOrAmt").attr("placeholder", "Enter Km");
        }
    }

    function getTimeDifference(event) {

        let cardId = $(event).parent().parent().parent().parent().parent().attr('id');
        var x = $('#'+cardId+' .startTime').val().toString();
        var y = $('#'+cardId+' .endTime').val().toString();

        // let startTime = $('#'+cardId+' .startTime').val().split(':');
        // let endTime = $('#'+cardId+' .endTime').val().split(':');

        if (x.length > 0 && y.length > 0) {
            let startTime = x.split(':');
            let endTime = y.split(':');
           
            let diffValue = ((parseInt(endTime[0])*60)+parseInt(endTime[1])) - 
                                ((parseInt(startTime[0])*60)+parseInt(startTime[1]));



            if (diffValue > 0) {
                let hours = Math.floor(diffValue/60);
                let minutes = diffValue % 60;
                $('#'+cardId+' .workedHours').val(hours+'.'+minutes);
            }
            else{
                $('#'+cardId+' .workedHours').val('');
            }
        }
        
    }

    function modifyTimesheetContract(event) { 
        
        let cardId = $(event).parent().parent().parent().parent().attr('id');
        
        let bookingData = {
            ApprovalStatus: "Not Confirmed",
            CalculatedHours: $('#'+cardId+' .workedHours').val(),
        
            Timesheetcomment: $('#'+cardId+' .description').val(),
            // ContractID: $('#'+cardId+' .contract').attr("data-contractid"),
            ContractID:$('#'+cardId+' .contract').attr("data-contractid"),

            DateOfBooking: cardDate,
        
            EmployeeID: primaryDetails.EmployeeId,
            EmployeeName: primaryDetails.FirstName,
        
            StartTime: "PT"+$('#'+cardId+' .startTime').val().replace(":","H")+"M00S",
            EndTime: "PT"+$('#'+cardId+' .endTime').val().replace(":","H")+"M00S",
        
            LifeCycleStatus: "Not Released",
            
            // TotalKMperday: $('#'+cardId+' .kmOrAmt').val(),
            // PublicTransportAmount: $('#'+cardId+' .kmOrAmt').val(),
        
            ProjectTaskID: $('#'+cardId+' .contract').attr("data-taskid"),
            ProjectTaskName: $('#'+cardId+' .contract').attr("data-taskname"),
        
            SchoolId: $('#'+cardId+' .schoolContract').attr("data-schoolid"),
            SchoolDescription: $('#'+cardId+' .schoolContract').val(),
        
            ServiceID: $('#'+cardId+' .service').attr("data-serviceid"),
            TravellingBy: $('#'+cardId+' .travelby').val(),
            Operation: "Create"
        }

        // Create operation
        if (event.value == 'Submit') {           
          
            if ($('#'+cardId+' .travelby').val() == 'PublicTransport') {
                bookingData["PublicTransportAmount"] = $('#'+cardId+' .kmOrAmt').val();
            }
            else {
                bookingData["TotalKMperday"] = $('#'+cardId+' .kmOrAmt').val();
            }

            console.log(JSON.stringify(bookingData));

            fetch(`${httpURL}/contractemployeetimesheetlist`,{
            // fetch(`https://r9mjde4m5j.execute-api.eu-central-1.amazonaws.com/mock/contractemployeetimesheetlistcalendar`,{
                method: 'POST',
                body: JSON.stringify(bookingData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                $('#btn-bookTimeContract').prop('disabled',false);
                
                let headerNameId = cardId.substring(9);
                $('#div'+headerNameId+' .accordion-button').removeClass('collpased');
                $('#'+cardId).removeClass('show');

                $('#'+cardId+' .contract').prop('disabled',true);
                $('#'+cardId+' .contract').attr('data-objectuuid',data.ContractEmployeeTimesheetCreate.ObjectUUID);
                $('#'+cardId+' .contract').attr('data-contractid',data.ContractEmployeeTimesheetCreate.ContractId);
                $('#'+cardId+' .contract').val(data.ContractEmployeeTimesheetCreate.ContractDescription);
                $('#'+cardId+' .contract').attr('data-taskid',data.ContractEmployeeTimesheetCreate.ProjectTaskId);
                $('#'+cardId+' .contract').attr('data-taskname',data.ContractEmployeeTimesheetCreate.ProjectTaskName);

                $('#'+cardId+' .service').attr('data-serviceid',data.ContractEmployeeTimesheetCreate.ServiceId);
                $('#'+cardId+' .service').val(data.ContractEmployeeTimesheetCreate.ServiceDescription);

                $('#'+cardId+' .school').attr('data-schoolid',data.ContractEmployeeTimesheetCreate.SchoolID);
                $('#'+cardId+' .school').val(data.ContractEmployeeTimesheetCreate.SchoolDescription);
                $('#'+cardId+' .school').prop('disabled',true);

                $('#'+cardId+' .startTime').val(((data.ContractEmployeeTimesheetCreate.StartTime).substring(2,(data.ContractEmployeeTimesheetCreate.StartTime).length-1).replace("H",":")).replace("M",":"));
                $('#'+cardId+' .endTime').val(((data.ContractEmployeeTimesheetCreate.EndTime).substring(2,(data.ContractEmployeeTimesheetCreate.EndTime).length-1).replace("H",":")).replace("M",":"));

                if (data.ContractEmployeeTimesheetCreate.TravellingBy == 'Car' ||
                        data.ContractEmployeeTimesheetCreate.TravellingBy == 'CAR') {
                    $('#'+cardId+' .travelby').val(data.ContractEmployeeTimesheetCreate.TravellingBy);
                    $('#'+cardId+' .kmOrAmt').val(data.ContractEmployeeTimesheetCreate.TotalKMPerDay);
                }
                else if (data.ContractEmployeeTimesheetCreate.TravellingBy == 'Public Transport' ||
                            data.ContractEmployeeTimesheetCreate.TravellingBy == 'PublicTransport') {
                    $('#'+cardId+' .travelby').val(data.ContractEmployeeTimesheetCreate.TravellingBy);
                    $('#'+cardId+' .kmOrAmt').val(data.ContractEmployeeTimesheetCreate.PublicTransporthAmount);
                                
                }
               $('#'+cardId+' .workedHours').val(data.ContractEmployeeTimesheetCreate.CalculatedHours);
               $('#'+cardId+' .plannedHours').val(data.ContractEmployeeTimesheetCreate.PlannedHours);
               $('#'+cardId+' .reportedHours').val(data.ContractEmployeeTimesheetCreate.ReportedHours);

               
                $('#div'+headerNameId+' .cardDate').text("  ("+(data.ContractEmployeeTimesheetCreate.StartTime).substring(2,(data.ContractEmployeeTimesheetCreate.StartTime).length-1).replace('H',":")+
                                                                (data.ContractEmployeeTimesheetCreate.EndTime).substring(2,(data.ContractEmployeeTimesheetCreate.EndTime).length-1).replace('H',":"));

                // $('#'+cardId+' .hours').val("("+(data.TimesheetUpdate.Hours).substring(2,(data.TimesheetUpdate.Hours).length-1).replace('H',":")+")");
               $('#'+cardId+' .description').val(data.ContractEmployeeTimesheetCreate.Timesheetcomment);

                // $('#'+cardId+' .task').attr("data-timeuuid",data.TimesheetUpdate.EmployeeTimeUUID);
                // $('#'+cardId+' .task').attr("data-itemuuid",data.TimesheetUpdate.EmployeeItemUUID);
                // $('#'+cardId).removeClass('card-danger').addClass('card-secondary');
                
               
                $('#'+cardId+' .btnSubmitContract').val("Update");
                $('#'+cardId+' .btnClearContract').hide();
                $('#'+cardId+' .btnReleaseContract').show();

                appendToCalenderContract();
                toastr.success("Timesheet created Successfully.","Done!");
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

        // Update operation
        if (event.value == 'Update') {   
            
            bookingData["ObjectUUID"] = $('#'+cardId+' .contract').attr("data-objectuuid");
            bookingData.Operation = 'Update';
            bookingData.LifeCycleStatus = '';
          
            if ($('#'+cardId+' .travelby').val() == 'PublicTransport') {
                bookingData["PublicTransportAmount"] = $('#'+cardId+' .kmOrAmt').val();
            }
            else {
                bookingData["TotalKMperday"] = $('#'+cardId+' .kmOrAmt').val();
            }

            // fetch(`${httpURL}/employeebookedlist`,{
                fetch(`${httpURL}/contractemployeetimesheetlist`,{
                method: 'POST',
                body: JSON.stringify(bookingData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
            .then(response => response.json())
            .then(data => {
                let headerNameId = cardId.substring(8);
                // if (data.TimesheetUpdate.ProjectName == "") {
                //     $('#div'+headerNameId+' .cardHeader').text(data.TimesheetUpdate.ActivityName);
                // }   
                // else{
                //     $('#div'+headerNameId+' .cardHeader').text(data.TimesheetUpdate.ProjectName);
                // }

                // $('#div'+headerNameId+' .cardDate').text("  ("+(data.TimesheetUpdate.Hours).substring(2,(data.TimesheetUpdate.Hours).length-1).replace('H',":")+")");
                // $('#'+cardId+' .hours').val("("+(data.TimesheetUpdate.Hours).substring(2,(data.TimesheetUpdate.Hours).length-1).replace('H',":")+")");

                // $('#'+cardId+' .task').attr("data-timeuuid",data.TimesheetUpdate.EmployeeTimeUUID);
                // $('#'+cardId+' .task').attr("data-itemuuid",data.TimesheetUpdate.EmployeeItemUUID);
                // $('#'+cardId).removeClass('card-danger').addClass('card-secondary');
                
                $('#Cdiv'+headerNameId+' .accordion-button').removeClass('collpased');
                $('#'+cardId).removeClass('show');

                $('#'+cardId+' .btnClearContract').hide();

                // appendToCalenderContract();
                toastr.info("Timesheet updated Successfully.","Done!");
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

        // Release operation
        if (event.value == 'Release') {   
            
            bookingData["ObjectUUID"] = $('#'+cardId+' .contract').attr("data-objectuuid");
            bookingData.Operation = 'Release';
            bookingData.LifeCycleStatus = '';
          
            if ($('#'+cardId+' .travelby').val() == 'PublicTransport') {
                bookingData["PublicTransportAmount"] = $('#'+cardId+' .kmOrAmt').val();
            }
            else {
                bookingData["TotalKMperday"] = $('#'+cardId+' .kmOrAmt').val();
            }

            // fetch(`${httpURL}/employeebookedlist`,{
                fetch(`${httpURL}/contractemployeetimesheetlist`,{
                method: 'POST',
                body: JSON.stringify(bookingData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
            .then(response => response.json())
            .then(data => {
                let headerNameId = cardId.substring(8);
                // if (data.TimesheetUpdate.ProjectName == "") {
                //     $('#div'+headerNameId+' .cardHeader').text(data.TimesheetUpdate.ActivityName);
                // }   
                // else{
                //     $('#div'+headerNameId+' .cardHeader').text(data.TimesheetUpdate.ProjectName);
                // }

                // $('#div'+headerNameId+' .cardDate').text("  ("+(data.TimesheetUpdate.Hours).substring(2,(data.TimesheetUpdate.Hours).length-1).replace('H',":")+")");
                // $('#'+cardId+' .hours').val("("+(data.TimesheetUpdate.Hours).substring(2,(data.TimesheetUpdate.Hours).length-1).replace('H',":")+")");

                // $('#'+cardId+' .task').attr("data-timeuuid",data.TimesheetUpdate.EmployeeTimeUUID);
                // $('#'+cardId+' .task').attr("data-itemuuid",data.TimesheetUpdate.EmployeeItemUUID);
                // $('#'+cardId).removeClass('card-danger').addClass('card-secondary');
                
                $('#Cdiv'+headerNameId+' .accordion-button').removeClass('collpased');
                $('#'+cardId).removeClass('show');

                $('#'+cardId+' .btnClearContract').hide();

                // appendToCalenderContract();
                toastr.info("Timesheet updated Successfully.","Done!");
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

        // Withdraw operation
        if (event.value == 'Withdraw') {   
            
            bookingData["ObjectUUID"] = $('#'+cardId+' .contract').attr("data-objectuuid");
            bookingData.Operation = 'Withdraw';
            bookingData.LifeCycleStatus = '';
          
            if ($('#'+cardId+' .travelby').val() == 'PublicTransport') {
                bookingData["PublicTransportAmount"] = $('#'+cardId+' .kmOrAmt').val();
            }
            else {
                bookingData["TotalKMperday"] = $('#'+cardId+' .kmOrAmt').val();
            }

            // fetch(`${httpURL}/employeebookedlist`,{
                fetch(`${httpURL}/contractemployeetimesheetlist`,{
                method: 'POST',
                body: JSON.stringify(bookingData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
            .then(response => response.json())
            .then(data => {
                let headerNameId = cardId.substring(8);
                // if (data.TimesheetUpdate.ProjectName == "") {
                //     $('#div'+headerNameId+' .cardHeader').text(data.TimesheetUpdate.ActivityName);
                // }   
                // else{
                //     $('#div'+headerNameId+' .cardHeader').text(data.TimesheetUpdate.ProjectName);
                // }

                // $('#div'+headerNameId+' .cardDate').text("  ("+(data.TimesheetUpdate.Hours).substring(2,(data.TimesheetUpdate.Hours).length-1).replace('H',":")+")");
                // $('#'+cardId+' .hours').val("("+(data.TimesheetUpdate.Hours).substring(2,(data.TimesheetUpdate.Hours).length-1).replace('H',":")+")");

                // $('#'+cardId+' .task').attr("data-timeuuid",data.TimesheetUpdate.EmployeeTimeUUID);
                // $('#'+cardId+' .task').attr("data-itemuuid",data.TimesheetUpdate.EmployeeItemUUID);
                // $('#'+cardId).removeClass('card-danger').addClass('card-secondary');
                
                $('#Cdiv'+headerNameId+' .accordion-button').removeClass('collpased');
                $('#'+cardId).removeClass('show');

                $('#'+cardId+' .btnClearContract').hide();

                // appendToCalenderContract();
                toastr.info("Timesheet updated Successfully.","Done!");
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

    
    // Calendar Event Update
    function appendToCalenderContract() {   
        let newDetails = [];

        // fetch(`${httpURL}/employeebookedlistcalender?employeeId=${empID}&startDate=${cardDate}&endDate=${cardDate}`)
        // fetch(`https://r9mjde4m5j.execute-api.eu-central-1.amazonaws.com/mock/contractemployeetimesheetreportedhours?employeeId=EnterEmployeeId&startDate=Enter`)
        fetch(`${httpURL}/contractemployeetimesheetreportedhours?employeeId=${primaryDetails.EmployeeId}&startDate=${cardDate}&endDate=${cardDate}`)
        .then(response => response.json())
        .then(res => {
            newDetails = res.ContractEmployeeReportedHours;
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
        })
        .catch(err => {
            toastr.error("Error Occurred in While Processing... Please Try Again or Contact Adiministrator",{ timeOut: 1000 });
        });

      
        
    }

/// End On Calendar Event Click
//////////////////////////////////////////////////////////////////////////////////
