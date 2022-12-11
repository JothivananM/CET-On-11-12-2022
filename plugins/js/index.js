/* (1) For AWS Cognito Authentication */


let poolData = {
    UserPoolId: 'us-east-1_GXY1dlA0N',
    ClientId: '4jda5cl6jc5t18k4s3c3g2uv06',
};
let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);



function loginUser() {

    let username = $('#text-username').val();
    let authenticationData = {
        Username: $('#text-username').val(),
        Password: $('#password').val()
    };
    // alert("authenticationData"+JSON.stringify(authenticationData));

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    let userData = {
        Username: username,
        Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    // alert("userData"+JSON.stringify(userData));

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {

            let accessToken = result.getIdToken().getJwtToken();
            let idToken = JSON.stringify(result.getIdToken());
            let refreshToken = result.refreshToken;

            // alert(idToken);

            $.cookie("auth", accessToken);
            //$.cookie("idtoken", idToken);
            // localStorage.setItem('test', idToken);

            let cognitoUser = userPool.getCurrentUser();
            // alert(cognitoUser);

            if (cognitoUser != null) {
                // alert('user exists');
                window.location = '/dashboard.html';
            } else {
                // alert('user not exists');
                // alert("fail");
                    window.location = '/index.html';
                
            }
        },
        onFailure: function (err) {
            // alert("failed to authenticate");
            // alert(JSON.stringify(err))
            //alert("Failed to Log in.\nPlease check your credentials.")
                $(document).Toasts('create', {
                  class: 'bg-danger',
                  title: 'Login Failed',
                  body: 'Please check your credentials and try again.'
                });
        },
    });
}


function forgotpasswordbutton() {


    let userData = {
        Username: document.getElementById("inputUsername").value,
        Pool: userPool,
    };

    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.forgotPassword({
        onSuccess: function (result) {
            // alert("call result: " + result);
            window.location = './index.html'
        },
        onFailure: function (err) {
            // alert(err);
            // alert(err);
        },
        inputVerificationCode() {
            let verificationCode = prompt(
                "Please input verification code ",
                ""
            );
            let newPassword = prompt("Enter new password ", "");
            cognitoUser.confirmPassword(verificationCode, newPassword, this);
        },
    });
}

function logOutUser() {

    var cognitoUser = userPool.getCurrentUser();
    // alert(cognitoUser);
    // alert(cognitoUser, "signing out...");
    cognitoUser.signOut();

    window.location = './index.html';

    var value = $.cookie("auth");

    // allCookies = document.cookie;
    //  document.cookie = "auth=; path=/;"
    //$.removeCookie(auth);

    document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

