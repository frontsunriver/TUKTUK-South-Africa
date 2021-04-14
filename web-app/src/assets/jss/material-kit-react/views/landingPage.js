import { container, title } from "assets/jss/material-kit-react.js";

const landingPageStyle = {
  container: {
    zIndex: "12",
    color: "#FFFFFF",
    ...container,
    alignContent:'center'
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    color: "#FFFFFF",
    textDecoration: "none"
  },
  gridcontainer:{
    alignContent:'center'
  },
  subtitle: {
    fontSize: "1.313rem",
    maxWidth: "500px",
    margin: "10px auto 0"
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  main2: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised2: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  items:{
    margin:0,
    width:'100%'
  },
  menuItems:{
    width:'100%'
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor:  "#E8E8E8",
    fontSize: 16,
    padding: '10px 2px 10px 10px',
    color:"#000"
  },
  inputdimmed: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor:  "#E8E8E8",
    fontSize: 16,
    padding: '10px 26px 10px 10px',
    color:"#737373"
  },
  commonInputStyle:{
    borderRadius: 4,
    backgroundColor: "#E8E8E8",
  },
  carphoto:{
    height: '16px',
    marginRight:'10px'
  }

};

export default landingPageStyle;
