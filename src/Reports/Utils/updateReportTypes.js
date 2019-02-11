export const updateReportType = (ReportType) => {
  let response = {
    reportType: '',
    yearReq: false,
    userReq: false,
    custReq: false,
    catReq: false,
    dueReq: false
  };
  switch (ReportType) {
  case 'customers_split':
    response = updateReportSplit(ReportType);

    break;
  case 'Year Totals':
    response = updateReportYear(ReportType);

    break;
  case 'Customer Year Totals':
    response = updateReportCustomerYear(ReportType);

    break;
  case 'Customer All-Time Totals':
    response = updateReportCustomerHistorical(ReportType);

    break;
  }
  return response;
  // this.updateChoices();
};

const updateReportCustomerHistorical = (ReportType) => {
  return {
    reportType: ReportType,
    yearReq: false,
    userReq: true,
    custReq: true,
    catReq: false,
    dueReq: false
  };
};

const updateReportCustomerYear = (ReportType) => {
  return {
    reportType: ReportType,
    yearReq: true,
    userReq: true,
    custReq: true,
    catReq: true,
    dueReq: true
  };
};

const updateReportYear = (ReportType) => {
  return {
    reportType: ReportType,
    yearReq: true,
    userReq: true,
    custReq: false,
    catReq: true,
    dueReq: true
  };
};

const updateReportSplit = (ReportType) => {
  return {
    reportType: ReportType,
    yearReq: true,
    userReq: true,
    custReq: false,
    catReq: true,
    dueReq: true
  };
};
