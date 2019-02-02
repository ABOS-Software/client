import hostURL from '../../host';
import download from 'downloadjs';

export default (record) => {
  const token = localStorage.getItem('token');
  let url = hostURL + '/reports';
  fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `${token}`
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(record)
  }).then(downloadPDFFile());
};

const downloadPDFFile = () => response => {
  let filename = 'report.pdf';
  const disposition = response.headers.get('content-disposition');
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    let matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }
  response.blob().then(blob => {
    download(blob, filename, 'application/pdf');
  });
};
