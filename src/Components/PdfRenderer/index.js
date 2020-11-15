import React from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import "./index.scss";

export default class PdfRenderer extends React.Component {
  resume = null;

  exportPDF = () => {
    this.resume.save();
  };

  render() {
    return (
      <>
        <button onClick={this.exportPDF}>download</button>
        <div
          // style={{
          //   opacity: "0.0",
          //   height: "0",
          //   width: "0",
          //   pointerEvents: "none",
          // }}
          className="pdf-export"
        >
          <PDFExport
            paperSize="A4"
            fileName={`${this.props.fileName || "raport"}.pdf`}
            title="lolz"
            subject=""
            keywords=""
            margin="0"
            scale={0.6}
            ref={(r) => (this.resume = r)}
          >
            <div
              style={{
                height: 1230,
                width: 930,
                backgroundColor: "white",
                boxShadow: "5px 5px 5px rgba(0,0,0,0.3)",
                margin: "auto",
                overflowX: "hidden",
                overflowY: "hidden",
                padding: "0.5rem",
              }}
            >
              <h3>{`Raport - ${this.props.header}`}</h3>
              {this.props.content || "no content"}
            </div>
          </PDFExport>
        </div>
      </>
    );
  }
}
