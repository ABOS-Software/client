import {convertFileToBase64} from './convertFileToBase64';
import {downloadPDF} from './index';

export const save = (record, redirect) => {
  if (record.LogoLocation && !record.LogoLocation.base64) {
    convertFileToBase64(record.LogoLocation).then(b64 => {
      record.LogoLocation.base64 = b64;
      downloadPDF(record);
    }
    );
  } else {
    downloadPDF(record);
  }
};
