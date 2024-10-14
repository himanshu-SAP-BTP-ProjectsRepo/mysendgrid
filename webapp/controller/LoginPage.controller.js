sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend(
      "com.incresol.sendgridfrontendapplication.controller.LoginPage",
      {
        onInit: function () {},
        onPressLoginButton: function () {
         
          var oRouter = this.getOwnerComponent().getRouter();
          
          // Get references to the Input fields
          var oUserIdInput = this.byId("userId").getValue();
          var oPasswordInput = this.byId("password").getValue();

          this.byId("userId").setValueState("None");
          this.byId("password").setValueState("None");
          this.byId("userId").setValueStateText("");
          this.byId("password").setValueStateText("");

          if (!oUserIdInput) {
            this.byId("userId").setValueState("Error");
            this.byId("userId").setValueStateText("please fill user id");

            sap.m.MessageToast.show("Please enter your User ID.");
            this.byId("userId").focus(); // Set focus to the User ID input
            return;
          }

          if (!oPasswordInput) {
            this.byId("password").setValueState("Error");
            this.byId("password").setValueStateText("please fill password");
            sap.m.MessageToast.show("Please enter your Password.");
            this.byId("password").focus(); // Set focus to the Password input
            return;
          }
          var payload = {
            username: oUserIdInput,
            password: oPasswordInput,
          };

          $.ajax({
            url:"https://sendgrid-mail-status-application-1.onrender.com/api/login",
           
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(payload),

            complete: function (xhr, status) {
              console.log(xhr)
              if (
                xhr.responseJSON.status == 200 &&
                xhr.responseJSON.message == "Login successful!"
              ) {
                var token = xhr.responseJSON.token;
                localStorage.setItem("apptoken", token);
                oRouter.navTo("RouteHeaderPage");
              } else {
                sap.m.MessageToast.show("invalid credentials ");
              }
            },
          });
        },
      }
    );
  }
);
