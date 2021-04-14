import { container } from "assets/jss/material-kit-react.js";
import { title } from "assets/jss/material-kit-react.js";

const downloadStyle = {
  section: {
    padding: "70px 0",
  },
  container,
  textCenter: {
    textAlign: "center"
  },
  sharingArea: {
    marginTop: "80px"
  },
  socials: {
    maxWidth: "24px",
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    fontSize: "20px",
    marginRight: "4px"
  },
  title: {
    ...title,
    marginBottom: "2rem",
    marginTop: "10px",
    minHeight: "32px",
    textDecoration: "none"
  },
  description: {
    color: "#999",
    marginBottom: "2rem",
    marginTop: "2rem",
  },
  triobanner:{
    width:'60%',
  },
  downloadlinks:{
    width: 10
  }
};

export default downloadStyle;
