// Formatter.js
sap.ui.define([], function () {
  "use strict";
  return {
    formatDateTime: function (dateTime) {
      if (!dateTime) {
        return "";
      }
      // Split the date and time
      const datePart = dateTime.split("T")[0];
      const timePart = dateTime.split("T")[1].substring(0, 8); // Keep only HH:mm:ss

      return {
        date: datePart,
        time: timePart,
      };
    },
  };
});
