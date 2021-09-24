import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  home_container: {
    margin: theme.spacing(12, 0),
  },
  mobile_home_container: {
    marginTop: theme.spacing(12),
  },
}));

const Home = () => {
  const classes = useStyles();

  const homeMatches = useMediaQuery("(min-width:730px)");
  return (
    <>
      <Helmet>
        <title>Home | Admin Template</title>
      </Helmet>
      {homeMatches ? (
        <Container className={classes.home_container}>
          <h1>Home</h1>
        </Container>
      ) : (
        <Container className={classes.mobile_home_container}>
          <h1>Home</h1>
        </Container>
      )}
    </>
  );
};

export default Home;
