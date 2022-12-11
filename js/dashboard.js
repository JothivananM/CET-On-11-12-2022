let primaryDetails;
let idToken;
let httpURL = 'https://lj8f09lng9.execute-api.eu-central-1.amazonaws.com/Prod';

$('#ec4-ManagerPayrollProcessingPage').hide();
$('#ec4-ManagerTimesheetConfirmationPage').hide();
$('#ec5-ContractReportingStatusPage').hide();
$('#ec5-ContractApprovalPage').hide();

// $('#ec4-ManagerTimesheetConfirmationPage').hide();

    $.protip();
    // $(".myTimesetter").timesetter();

    // Get Token
    // let credentialData = {
    //     grant_type : "authorization_code",
    //     client_id : "3kcg9798q61gpm5j7i7q63gd2o",
    //     code : "",
    //     redirect_uri : "https://master.d2k7qbs5p2sksn.amplifyapp.com/dashboard.html"
    // }

        // let clientId = credentialData.client_id;
        // let clientSecret = "1fm29ls76qvpclrvifthc2jc2vp9qcr7nhuiislkl5qnekm1lf31"
        // let authorizationString = btoa(clientId+":"+clientSecret);

        // console.log("AUTH",authorizationString);

        let queryString = window.location.hash.substr(1);
        // console.log("queryString",queryString);
        let urlParams = new URLSearchParams(queryString);
        // console.log("URL",urlParams);
        idToken = urlParams.get('id_token')
        // console.log("TOKEN",token);

        // credentialData.code = token;
    

    // $.ajax({
    //     type: "POST",
    //     url: "https://cet.auth.eu-central-1.amazoncognito.com/oauth2/token",
    //     dataType: "dataType",
    //     contentType : "application/x-www-form-urlencoded",
    //     Autorization : "Basic "+authorizationString,
    //     data: credentialData,
              
    //     success: function (response) {
    //             console.log("TOKEN",response);
    //     }
    // });

    $("#exampleModalCenter").modal("show");

    let payload = JSON.parse(window.atob(idToken.split('.')[1])); 
    // console.log(payload);
    // console.log("PAYLOAD",);

    $.ajax({

          type: "GET",
          url: "https://lj8f09lng9.execute-api.eu-central-1.amazonaws.com/Prod/employeeDetails?employeeMailId="+payload.identities[0].userId,
          dataType: "json",
          async: false,
          success: function (successdata) {
            console.log("SUCCESS",successdata);
            primaryDetails = successdata.EmployeeDetails;
              // profileData(profilePageList);
          },
          error: function (response,error,message) {
            toastr.error("Error Occurred While Processing... Redirecting to Login", "Error : " +response.status, { timeOut: 3000 });
            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
                window.location = './index.html';
            }, 3000);
          },

      });

      //Calendar
      if(primaryDetails.EmployeeCatagory == 'EC5')
      {
        $('.Contract').show();
      }
      else
      {
        $('.Employee').show();
      }

      //Menu
      if (primaryDetails.EmployeeCatagory == 'EC4') {
            $('#ec4-ManagerPayrollProcessingPage').show();
            $('#ec4-ManagerTimesheetConfirmationPage').show();
            $('#ec5-ContractReportingStatusPage').hide();
            $('#ec5-ContractApprovalPage').hide();
      }
      else if (primaryDetails.EmployeeCatagory == 'EC5') {
        $('#ec5-ContractReportingStatusPage').show();
        $('#ec5-ContractApprovalPage').show();  
        $('#ec1-EmployeeReportingPage').hide();
      }
