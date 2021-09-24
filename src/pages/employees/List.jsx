import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import {
  IconButton,
  LinearProgress,
  makeStyles,
  Paper,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";

import {
  useDeleteEmployeeMutation,
  useGetDesignationsQuery,
  useGetEmployeesQuery,
} from "../../redux/usersApi";

const useStyles = makeStyles((theme) => ({
  main_container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: theme.spacing(12, 2),
    padding: theme.spacing(3),
  },
  title_wrapper: {
    marginBottom: theme.spacing(3),
  },
  grid_items_left: {
    marginLeft: theme.spacing(0),
  },
  grid_items_right: {
    marginRight: theme.spacing(0),
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    marginRight: theme.spacing(2),
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
    margin: theme.spacing(2, 0, 2),
  },
  mobile_create_button: {
    marginRight: theme.spacing(0),
  },
}));

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
  const { id } = props;
  const classes = useStyles();
  const history = useHistory();

  const [deleteEmployees, { isError }] = useDeleteEmployeeMutation();

  if (isError) {
    toast.error("Something went wrong", {
      position: "top-center",
      autoClose: 3000,
    });
  }

  const handleEdit = (editId) => {
    history.push(`/employees/${editId}/edit`);
  };

  const handleDelete = async (deleteId) => {
    try {
      await deleteEmployees(deleteId);

      history.push(`/employees`);

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
        onClick={() => handleEdit(id)}
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

export default function List() {
  const classes = useStyles();

  const [pageSize, setPageSize] = useState(5);
  const [employeeData, setEmployeeData] = useState([]);
  const [designationData, setDesignationData] = useState([]);

  const {
    data: empData,
    isSuccess: isEmpSuccess,
    isLoading,
    isError: isEmployeeError,
  } = useGetEmployeesQuery();

  const {
    data: dsgnData,
    isSuccess: isDsgnSuccess,
    isError: isDesignationError,
  } = useGetDesignationsQuery();

  useEffect(() => {
    if (isEmpSuccess) {
      setEmployeeData(empData.data);
    }
    if (isDsgnSuccess) {
      setDesignationData(dsgnData.data);
    }
  }, [
    dsgnData,
    isDsgnSuccess,
    empData,
    isEmpSuccess,
    isEmployeeError,
    isDesignationError,
  ]);

  if (isEmployeeError) {
    setDesignationData([]);
    toast.error("Data not Loaded successfully", {
      position: "top-center",
      autoClose: 2000,
    });
  }
  if (isDesignationError) {
    setDesignationData([]);
    toast.error("Data not Loaded successfully", {
      position: "top-center",
      autoClose: 2000,
    });
  }

  let designationName;
  function designation(dsgnId) {
    for (const dsgn of designationData) {
      if (dsgn.id === dsgnId) {
        designationName = dsgn.name;
      }
    }
    return designationName;
  }

  let rows = employeeData.map((item, index) => {
    return {
      ...item,
      keys: index + 1,
      date_of_birth: new Date(item.date_of_birth).toLocaleDateString(),
      join_date: new Date(item.join_date).toLocaleDateString(),
      designation_id: designation(item.designation_id),
    };
  });

  const columns = [
    {
      field: "keys",
      headerAlign: "right",
      headerName: "Sl No",
      width: 120,
      align: "right",
    },
    {
      field: "first_name",
      headerName: "First Name",
      width: 150,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "last_name",
      headerName: "Last Name",
      width: 150,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "join_date",
      headerName: "Join Date",
      width: 150,
      type: "date",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "date_of_birth",
      headerName: "Date of Birth",
      width: 180,
      type: "date",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 150,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "designation_id",
      headerName: "Designation",
      width: 180,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "left",
      width: 250,
      align: "left",
    },
    {
      field: "profile_picture",
      headerName: "Profile Picture",
      width: 180,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "resume",
      headerName: "Resume",
      width: 150,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: RowMenuCell,
      sortable: false,
      width: 100,
      align: "center",
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableReorder: true,
    },
  ];

  const isDesktop = useMediaQuery("(min-width:730px)");

  return (
    <>
      <Helmet>
        <title> Employees | Admin Template</title>
      </Helmet>
      <Paper
        className={
          isDesktop ? classes.main_container : classes.mobile_container
        }
      >
        <Grid
          container
          className={
            isDesktop ? classes.title_wrapper : classes.mobile_title_wrapper
          }
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item className={classes.grid_items_left}>
            <Typography variant="h6" component="h1">
              Employees
            </Typography>
          </Grid>
          <Grid item className={classes.grid_items_right}>
            {isDesktop ? (
              <NavLink
                to="/employees/create"
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
                  Create Employee
                </Button>
              </NavLink>
            ) : (
              <NavLink
                to="/employees/create"
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
                  <PersonAddIcon />
                </Button>
              </NavLink>
            )}
          </Grid>
        </Grid>
        <div style={{ width: "100%" }}>
          <DataGrid
            autoHeight
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
    </>
  );
}
