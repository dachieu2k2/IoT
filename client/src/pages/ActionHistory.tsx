import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { tokens } from "../common/theme";
import { Header } from "../Components";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "Thiết bị", headerName: "Thiết bị", width: 200 },
  { field: "Hành động", headerName: "Hành động", width: 200 },
  { field: "Thời gian", headerName: "Thời gian", width: 200 },
  // {
  //   field: "age",
  //   headerName: "Age",
  //   type: "number",
  //   width: 90,
  // },
  // {
  //   field: "fullName",
  //   headerName: "Full name",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const ActionHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      {/* Header */}
      <Header title="Action History" subtitle="Lịch sử bật tắt đèn và quạt" />

      {/* Search */}
      <Box display="flex" justifyContent="space-between" py={2}>
        {/* SEARCH BAR */}
        <Box display={"flex"}>
          <InputBase
            sx={{ flex: 1, backgroundColor: colors.primary[400], px: 2 }}
            placeholder="Search"
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Data */}

      <div style={{ height: "60vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          // sx={{}}
        />
      </div>
    </>
  );
};

export default ActionHistory;
