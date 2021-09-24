import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import { GridToolbarContainer } from "@mui/x-data-grid-pro";
import {
  Grid,
  LinearProgress,
  Paper,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";

import { createTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

import {
  useDeleteDesignationMutation,
  useGetDesignationsQuery,
} from "../../redux/usersApi";

const defaultTheme = createTheme();

const useStyles = makeStyles(
  (theme) => ({
    main_container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      margin: theme.spacing(12, 2),
      padding: theme.spacing(3),
    },
    wrapper: {
      marginBottom: theme.spacing(3),
    },
    grid_items_left: {
      marginLeft: theme.spacing(0),
    },
    grid_items_right: {
      marginRight: theme.spacing(0),
    },
    mobile_container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: theme.spacing(12, 2),
      padding: theme.spacing(3),
    },
    mobile_title_wrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: theme.spacing(1, 0, 2),
    },
    mobile_create_button: {
      marginRight: theme.spacing(0),
    },
  }),
  { defaultTheme }
);

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

function RowMenuCell(props) {
  const history = useHistory();

  const { id } = props;
  const classes = useStyles();

  const [deleteDesignations, { isError }] = useDeleteDesignationMutation();

  if (isError) {
    toast.error("Something went wrong", {
      position: "top-center",
      autoClose: 3000,
    });
  }

  const handleEditClick = (editId) => {
    history.push(`/designations/${editId}/edit`);
  };

  const handleDelete = async (deleteId) => {
    try {
      await deleteDesignations(deleteId);

      history.push(`/designations`);

      toast.success("Successfully deleted...", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (err) {}
  };

  return (
    <div className={classes.root}>
      <IconButton
        color="inherit"
        className={classes.textPrimary}
        size="small"
        aria-label="edit"
        onClick={() => handleEditClick(id)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        color="inherit"
        size="small"
        aria-label="delete"
        onClick={() => handleDelete(id)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

RowMenuCell.propTypes = {
  api: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default function List() {
  const classes = useStyles();
  const [designationData, setDesignationData] = useState([]);
  const { data, isLoading, isError, isSuccess } = useGetDesignationsQuery();
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (isSuccess) {
      setDesignationData(data.data);
    }
  }, [data, isSuccess]);

  if (isError) {
    toast.error("Data not Loaded successfully", {
      position: "top-center",
      autoClose: 2000,
    });
  }

  const rows =
    (data &&
      designationData.map((item, index) => {
        return { keys: index + 1, id: item.id, name: item.name };
      })) ||
    [];

  const isDesktop = useMediaQuery("(min-width:730px)");

  const desktopColumn = [
    {
      field: "keys",
      align: "right",
      headerAlign: "right",
      headerName: "Sl No",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 5,

      align: "left",
      headerAlign: "left",
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: RowMenuCell,
      sortable: false,
      flex: 1,
      headerAlign: "center",
      filterable: false,
      align: "center",
      disableColumnMenu: true,
      disableReorder: true,
    },
  ];
  const mobileColumn = [
    {
      field: "keys",
      align: "right",
      headerAlign: "center",
      headerName: "Sl No",
      width: 120,
    },
    {
      field: "name",
      headerName: "Name",
      width: 250,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: RowMenuCell,
      sortable: false,
      width: 150,
      headerAlign: "center",
      filterable: false,
      align: "center",
      disableColumnMenu: true,
      disableReorder: true,
    },
  ];
  const columns = isDesktop ? desktopColumn : mobileColumn;

  return (
    <>
      <Helmet>
        <title> Designations | Admin Template</title>
      </Helmet>
      {isDesktop ? (
        <Paper className={classes.main_container}>
          <Grid
            container
            className={classes.wrapper}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item className={classes.grid_items_left}>
              <Typography variant="h6" component="h1">
                Designations
              </Typography>
            </Grid>
            <Grid item className={classes.grid_items_right}>
              <GridToolbarContainer>
                <NavLink
                  to="/designations/create"
                  className="link"
                  style={{ color: "#000" }}
                  activeClassName="active"
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.button}
                    startIcon={<AddIcon />}
                  >
                    Create Designation
                  </Button>
                </NavLink>
              </GridToolbarContainer>
            </Grid>
          </Grid>
          <div style={{ width: "100%" }}>
            <DataGrid
              autoHeight
              hideFooterSelectedRowCount
              rows={rows}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20]}
              components={{
                LoadingOverlay: CustomLoadingOverlay,
              }}
              loading={isLoading}
            />
          </div>
        </Paper>
      ) : (
        <Paper className={classes.mobile_container}>
          <Grid container className={classes.mobile_title_wrapper}>
            <Grid item>
              <Typography variant="h6" component="h1">
                Designations
              </Typography>
            </Grid>
            <Grid item>
              <GridToolbarContainer>
                <NavLink
                  to="/designations/create"
                  className="link"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeClassName="active"
                >
                  <Button
                    color="secondary"
                    variant="outlined"
                    className={classes.mobile_create_button}
                  >
                    <AddIcon />
                  </Button>
                </NavLink>
              </GridToolbarContainer>
            </Grid>
          </Grid>
          <div style={{ width: "100%" }}>
            <DataGrid
              autoHeight
              pagination
              rows={rows}
              columns={columns}
              autoPageSize
              hideFooterSelectedRowCount
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 100]}
              components={{
                LoadingOverlay: CustomLoadingOverlay,
              }}
              loading={isLoading}
            />
          </div>
        </Paper>
      )}
    </>
  );
}
