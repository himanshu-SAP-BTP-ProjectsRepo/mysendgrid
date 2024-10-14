sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../controller/Formatter",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Table",
    "sap/m/Text",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    //"sap/ui/export/Spreadsheet",
  ],
  function (
    Controller,
    JSONModel,
    Formatter,
    MessageBox,
    Dialog,
    Button,
    Table,
    Text,
    Filter,
    FilterOperator,
    Spreadsheet
  ) {
    "use strict";

    return Controller.extend(
      "com.incresol.sendgridfrontendapplication.controller.HeaderPage",
      {
        onInit: function () {
          this._oModel = new JSONModel();
          this.getView().setModel(this._oModel);
          this.refreshData(); // Load initial data
        },

        refreshData: function () {
          var oModel = this._oModel;

          // Fetch data from the API
          oModel.loadData(
            "http://104.237.9.177:3000/mail-status-by-date",
            {},
            true,
            "GET",
            false,
            false,
            {
              Authorization: localStorage.getItem("apptoken"),
            }
          );

          // Attach event handler for data load success
          oModel.attachRequestCompleted((oEvent) => {
            if (oEvent.getParameter("success")) {
              var data = oModel.getData();
              oModel.setData({ MailStatus: data.data });
            }
          });

          // Attach event handler for data load error
          oModel.attachRequestFailed(() => {
            MessageBox.error("Failed to load mail status data.");
          });
        },

        onSelectionChange: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("listItem");
          if (oSelectedItem) {
            var sSelectedText = oSelectedItem.getCells()[0].getText();
            this._openEventDetailsDialog(sSelectedText);

            // Fetch event data
            this.fetchEventData(sSelectedText);
          }
        },

        fetchEventData: function (sSelectedText) {
          var myModel = new JSONModel();

          // Fetch data from the API
          myModel.loadData(
            `http://104.237.9.177:3000/event/${sSelectedText}`,
            {},
            true,
            "GET",
            false,
            false,
            {
              Authorization: localStorage.getItem("apptoken"),
            }
          );

          // Attach event handler for data load success
          myModel.attachRequestCompleted((oEvent) => {
            if (oEvent.getParameter("success")) {
              var data = myModel.getData();
              myModel.setData({ eventdata: data.data });
            }
          });

          // Attach event handler for data load error
          myModel.attachRequestFailed(() => {
            MessageBox.error("Failed to load event data.");
          });

          this.getView().setModel(myModel);
        },

        _openEventDetailsDialog: function (sSelectedText) {
          if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment(
              "com.incresol.sendgridfrontendapplication.fragment.Events",
              this
            );
            this.getView().addDependent(this._oDialog);
          }

          this._oDialog.open();
        },

        onCloseDialog: function () {
          this._oDialog.close();
          location.reload();
        },

        onFilterByDate: function () {
          const oDatePicker = this.byId("inputDate");
          const sStartDate = oDatePicker.getDateValue();

          var oMod = this._oModel;

          // Fetch data from the API
          oMod.loadData(
            `http://104.237.9.177:3000/mail-status-by-date?date=${sStartDate}`,
            {},
            true,
            "GET",
            false,
            false,
            {
              Authorization: localStorage.getItem("apptoken"),
            }
          );

          // Attach event handler for data load success
          oMod.attachRequestCompleted((oEvent) => {
            if (oEvent.getParameter("success")) {
              var data = oMod.getData();
              oMod.setData({ MailStatus: data.MailStatus });
            }
          });

          // Attach event handler for data load error
          oMod.attachRequestFailed(() => {
            MessageBox.error("Failed to load mail status data.");
          });

          this.getView().setModel(oMod);
        },

        onFilterByTo: function () {
          const oInputTo = this.byId("inputTo");
          const sToValue = oInputTo.getValue();

          var oMod1 = this._oModel;

          // Fetch data from the API
          oMod1.loadData(
            `http://104.237.9.177:3000/mail-status-by-to?to=${sToValue}`,
            {},
            true,
            "GET",
            false,
            false,
            {
              Authorization: localStorage.getItem("apptoken"),
            }
          );

          // Attach event handler for data load success
          oMod1.attachRequestCompleted((oEvent) => {
            if (oEvent.getParameter("success")) {
              var data = oMod1.getData();
              oMod1.setData({ MailStatus: data.MailStatus });
            }
          });

          // Attach event handler for data load error
          oMod1.attachRequestFailed(() => {
            MessageBox.error("Failed to load mail status data.");
          });

          this.getView().setModel(oMod1);
        },

        // onDownloadExcel: function () {
        //   const oTable = this.getView().byId("idProductsTable");

        //   // Assuming the binding is to a model that has all the data
        //   const oModel = oTable.getModel();
        //   const sPath = oTable.getBinding("items").getPath();

        //   // Fetch all data from the model
        //   const aData = oModel.getProperty(sPath).map((item) => ({
        //     to: item.to,
        //     start_time: item.start_time,
        //     latest_time: item.latest_time,
        //     first_event_status: item.first_event_status,
        //     latest_event_status: item.latest_event_status,
        //     deferred: item.event_count ? item.event_count.deferred || 0 : 0,
        //     delivered: item.event_count ? item.event_count.delivered || 0 : 0,
        //     open: item.event_count ? item.event_count.open || 0 : 0,
        //     click: item.event_count ? item.event_count.click || 0 : 0,
        //     bounce: item.event_count ? item.event_count.bounce || 0 : 0,
        //     dropped: item.event_count ? item.event_count.dropped || 0 : 0,
        //     spamreport: item.event_count ? item.event_count.spamreport || 0 : 0,
        //     unsubscribe: item.event_count
        //       ? item.event_count.unsubscribe || 0
        //       : 0,
        //   }));

        //   const aColumns = [
        //     { label: "TO", property: "to" },
        //     { label: "Start Time", property: "start_time" },
        //     { label: "Latest Time", property: "latest_time" },
        //     { label: "First Event", property: "first_event_status" },
        //     { label: "Latest Event", property: "latest_event_status" },
        //     { label: "Deferred", property: "deferred" },
        //     { label: "Delivered", property: "delivered" },
        //     { label: "Open", property: "open" },
        //     { label: "Click", property: "click" },
        //     { label: "Bounce", property: "bounce" },
        //     { label: "Dropped", property: "dropped" },
        //     { label: "Spam Report", property: "spamreport" },
        //     { label: "Unsubscribe", property: "unsubscribe" },
        //   ];

        //   // Get current date in 'YYYY-MM-DD' format
        //   const currentDate = new Date().toISOString().split("T")[0];

        //   const oSpreadsheet = new Spreadsheet({
        //     workbook: {
        //       columns: aColumns,
        //       // Set the sheet name
        //       name: "Mail Status",
        //     },
        //     dataSource: aData,
        //     // Name the file with the current date
        //     fileName: `MailStatus_${currentDate}.xlsx`,
        //   });

        //   oSpreadsheet
        //     .build()
        //     .then(function () {
        //       oSpreadsheet.destroy();
        //     })
        //     .catch(function (oError) {
        //       MessageBox.error("Error generating spreadsheet.");
        //     });
        // },

        

        onLogoutPress: function () {
          localStorage.removeItem("apptoken");
          this.getOwnerComponent().getRouter().navTo("RouteLoginPage");
          location.reload();
        },

        onSearchLiveChange: function (oEvent) {
          var sQuery = oEvent.getParameter("value");

          var oTable = this.getView().byId("idProductsTable");
          var oBinding = oTable.getBinding("items");

          var aFilters = [];
          if (sQuery) {
            aFilters.push(new Filter("to", FilterOperator.Contains, sQuery));
            aFilters.push(
              new Filter("start_time", FilterOperator.Contains, sQuery)
            );
            aFilters.push(
              new Filter("latest_time", FilterOperator.Contains, sQuery)
            );
            aFilters.push(
              new Filter("first_event_status", FilterOperator.Contains, sQuery)
            );
            aFilters.push(
              new Filter("latest_event_status", FilterOperator.Contains, sQuery)
            );

            var oCombinedFilter = new Filter({
              filters: aFilters,
              and: false, // Use OR logic
            });

            oBinding.filter([oCombinedFilter]);
          } else {
            oBinding.filter([]);
          }
        },

        onPressRefresh: function () {
          location.reload();
        },
      }
    );
  }
);
