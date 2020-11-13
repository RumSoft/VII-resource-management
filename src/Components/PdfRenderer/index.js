import React from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { Card } from "semantic-ui-react";

export default class PdfRenderer extends React.Component {
  resume = null;

  exportPDF = () => {
    this.resume.save();
  };

  render() {
    return (
      <>
        <button onClick={this.exportPDF}>download</button>
        <div style={{ opacity: "0.0", height: "0", width: "0" }}>
          <PDFExport
            paperSize="A4"
            fileName="raport.pdf"
            title=""
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
                padding: "none",
                backgroundColor: "white",
                boxShadow: "5px 5px 5px rgba(0,0,0,0.3)",
                margin: "auto",
                overflowX: "hidden",
                overflowY: "hidden",
                padding: "0.5rem",
              }}
            >
              <h3>Raport</h3>
              {this.props.content || "no content"}
            </div>
          </PDFExport>
        </div>
      </>
    );
  }
}
