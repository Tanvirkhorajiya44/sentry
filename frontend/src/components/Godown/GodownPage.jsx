import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Paper,
  Chip,
  Grid,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  TableContainer,
} from "@mui/material";
import {
  Warehouse as WarehouseIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import axios from "axios";

const godownOptions = ["Godown 1", "Godown 2"];

export default function GodownPage() {
  const [selected, setSelected] = useState(godownOptions[0]);
  const [stock, setStock] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("http://54.167.21.79:5000/api/godown/stock").then((res) => {
      setStock(res.data.stock.filter((s) => s.location === selected));
    });
    axios
      .get("http://54.167.21.79:5000/api/godown/transactions", {
        params: { location: selected },
      })
      .then((res) => setTransactions(res.data.transactions));
  }, [selected]);

  // Live refresh after dispatches
  useEffect(() => {
    const handler = (e) => {
      const location = e?.detail?.location || selected;
      axios.get("http://54.167.21.79:5000/api/godown/stock", { params: { location } }).then((res) => {
        const items = res.data.stock.filter((s) => s.location === location);
        setStock(items);
      });
      axios
        .get("http://54.167.21.79:5000/api/godown/transactions", { params: { location } })
        .then((res) => setTransactions(res.data.transactions));
    };
    window.addEventListener('refresh:godown', handler);
    return () => window.removeEventListener('refresh:godown', handler);
  }, [selected]);

  const totalQuantity = stock.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalProducts = stock.length;

  return (
    <Box
      sx={{
        maxWidth: {
          xs: "100%", // on extra-small screens
          sm: 600, // on small screens
          md: 900, // on medium screens
          lg: 1200, // on large screens
        },
        mx: "auto",
      }}
    >
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <WarehouseIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Godown Management
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Godown</InputLabel>
                <Select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  }
                  sx={{ borderRadius: 2 }}
                >
                  {godownOptions.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={1}
                sx={{ p: 2, backgroundColor: "#e3f2fd", borderRadius: 2 }}
              >
                <Typography
                  variant="subtitle2"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  Selected: {selected}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Products: {totalProducts} | Total Quantity:{" "}
                  {totalQuantity}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InventoryIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Current Stock ({stock.length})
                    </Typography>
                  </Box>
                </Box>

                <TableContainer
                  sx={{
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                      height: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#888",
                      borderRadius: 4,
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#555",
                    },
                  }}
                >
                  <Table sx={{ minWidth: 400 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          Product
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          Batch
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          Quantity
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stock.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            sx={{ textAlign: "center", py: 4 }}
                          >
                            <Typography variant="body1" color="text.secondary">
                              No stock found in {selected}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        stock.map((row, index) => (
                          <TableRow
                            key={row.id}
                            hover
                            sx={{
                              "&:nth-of-type(odd)": {
                                backgroundColor: "#fafafa",
                              },
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={index + 1}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "medium" }}
                                >
                                  {row.product}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={row.batch}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={row.quantity}
                                size="small"
                                color={
                                  row.quantity > 10
                                    ? "success"
                                    : row.quantity > 5
                                    ? "warning"
                                    : "error"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Transaction History ({transactions.length})
                    </Typography>
                  </Box>
                </Box>

                <TableContainer
                  sx={{
                    overflowX: "auto",
                    "&::-webkit-scrollbar": { height: 8 },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#888",
                      borderRadius: 4,
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#555",
                    },
                  }}
                >
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Batch</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Quantity
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            sx={{ textAlign: "center", py: 4 }}
                          >
                            <Typography variant="body1" color="text.secondary">
                              No transactions found for {selected}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((row, index) => (
                          <TableRow
                            key={row.id}
                            hover
                            sx={{
                              "&:nth-of-type(odd)": {
                                backgroundColor: "#fafafa",
                              },
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(row.date).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "medium" }}
                              >
                                {row.product}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={row.batch}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={row.quantity}
                                size="small"
                                color="info"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={
                                  row.type === "incoming" ? (
                                    <TrendingUpIcon />
                                  ) : (
                                    <TrendingDownIcon />
                                  )
                                }
                                label={
                                  row.type === "incoming"
                                    ? "Added"
                                    : "Dispatched"
                                }
                                size="small"
                                color={
                                  row.type === "incoming"
                                    ? "success"
                                    : "warning"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
