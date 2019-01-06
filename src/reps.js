import React from "react";
import download from "downloadjs";
import Button from "@material-ui/core/Button/Button";
import hostURL from "./host";

export const reps = props => (
    <UGYEditor {...props}/>
);

class UGYEditor extends React.Component {
    //users: {}, years: {}, customers: {}
    //users: {}, years: {}, customers: {}
    state = {};

    constructor(props) {
        super(props);

    }

    testReport() {
        let url = hostURL + '/reports/1';
        const token = localStorage.getItem('token');

        fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            encoding: null,

            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                // "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `${token}`

            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client

        }).then(response => {
            if (response.status === 200) {

                let filename = "report.pdf";
                console.log(response);

                const disposition = response.headers.get("content-disposition");
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    let matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }

                response.blob().then(blob => {
                    /*                console.log(blob);
                                    var buf = Buffer.from(blob.data, 'base64'); // Ta-da
                                    console.log(buf);*/

                    download(blob, filename, "application/pdf")
                });
            }

        })
    }

    render() {
        return (
            <Button onClick={this.testReport}>Test</Button>
        )
    }
}