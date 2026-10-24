import { useCallback, useEffect, useMemo, useState } from "react";
import axiosRequest from "./api/axios";

import {
  Add,
  AccountBalanceWallet,
  Archive,
  ArrowDownward,
  ArrowUpward,
  Brightness4,
  Brightness7,
  CheckCircle,
  Close,
  Dashboard,
  Folder,
  Groups,
  Language,
  Logout,
  Menu as MenuIcon,
  Notifications,
  OpenInFull,
  ReceiptLong,
  Wallet,
} from "@mui/icons-material";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const LIGHT_C = {
  background: "#F7F8FA",
  white: "#FFFFFF",
  primary: "#477CFF",
  primaryLight: "#EAF0FF",
  text: "#172B4D",
  secondary: "#64748B",
  border: "#E5EAF0",
  green: "#26A982",
  greenLight: "#E3F5EF",
  red: "#EE3338",
  redLight: "#FDE8E8",
  orange: "#EF9000",
  orangeLight: "#F9ECD7",
  grid: "#E3EAF2",
};

const DARK_C = {
  background: "#0f172a",
  white: "#111827",
  primary: "#7aa2ff",
  primaryLight: "#1e2a45",
  text: "#e5e7eb",
  secondary: "#a5b4c8",
  border: "#334155",
  green: "#31C48D",
  greenLight: "#123c31",
  red: "#f87171",
  redLight: "#3b1f2a",
  orange: "#fbbf24",
  orangeLight: "#3a2e1d",
  grid: "#2b3a4d",
};

function getPalette(isDark) {
  return isDark ? DARK_C : LIGHT_C;
}

const MONTHS = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

function getArray(data) {
  if (Array.isArray(data)) return data;

  for (const key of [
    "items",
    "users",
    "debts",
    "results",
    "contacts",
    "folders",
    "payments",
    "data",
  ]) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (Array.isArray(data?.data)) return data.data;

  return [];
}

function getAmount(item) {
  return Number(
    item?.amount ??
    item?.sum ??
    item?.total_amount ??
    item?.value ??
    0
  );
}

function getDate(item) {
  return (
    item?.created_at ??
    item?.createdAt ??
    item?.created_date ??
    item?.date ??
    item?.payment_date ??
    item?.due_date ??
    null
  );
}

function getName(item) {
  const contact = item?.contact ?? item?.user ?? item?.person;

  if (typeof contact === "string") return contact;

  return (
    contact?.name ??
    contact?.full_name ??
    contact?.fullName ??
    item?.contact_name ??
    item?.person_name ??
    item?.name ??
    item?.username ??
    "Без имени"
  );
}

function getDirection(item) {
  const value = String(
    item?.direction ?? item?.type ?? item?.debt_type ?? ""
  ).toLowerCase();

  if (
    [
      "they_owe_me",
      "incoming",
      "income",
      "owed_to_me",
      "мне должны",
      "мне",
    ].includes(value)
  ) {
    return "incoming";
  }

  if (
    [
      "i_owe_them",
      "outgoing",
      "expense",
      "i_owe",
      "я должен",
      "должен я",
    ].includes(value)
  ) {
    return "outgoing";
  }

  return value;
}

function money(value) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function dateText(value) {
  if (!value) return "Дата не указана";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Дата не указана";

  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function initials(name) {
  return String(name || "U")
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Panel({ children, sx = {}, palette = LIGHT_C }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        bgcolor: palette.white,
        border: `1px solid ${palette.border}`,
        borderRadius: "17px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function StatCard({ title, value, color, background, icon, active, palette = LIGHT_C }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        minHeight: 132,
        p: 2.8,
        bgcolor: palette.white,
        border: `1px solid ${active ? color : palette.border}`,
        borderRadius: "25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 54,
          height: 54,
          borderRadius: "17px",
          bgcolor: background,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0, textAlign: "right" }}>
        <Typography sx={{ color: palette.secondary, fontSize: 15, fontWeight: 600 }}>
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 1.3,
            color,
            fontSize: { xs: 23, md: 27 },
            fontWeight: 800,
            overflowWrap: "anywhere",
          }}
        >
          {value}{" "}
          <Box
            component="span"
            sx={{ color: palette.secondary, fontSize: 14, fontWeight: 500 }}
          >
            TJS
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}

function MonthlyChart({ debts, loading, palette = LIGHT_C }) {
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const chartData = useMemo(() => {
    const incoming = Array(12).fill(0);
    const outgoing = Array(12).fill(0);

    debts.forEach((debt) => {
      const rawDate = getDate(debt);
      if (!rawDate) return;

      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) return;
      if (date.getFullYear() !== Number(year)) return;

      const direction = getDirection(debt);
      const amount = getAmount(debt);

      if (direction === "incoming") incoming[date.getMonth()] += amount;
      if (direction === "outgoing") outgoing[date.getMonth()] += amount;
    });

    return MONTHS.map((month, index) => ({
      month,
      incoming: incoming[index],
      outgoing: outgoing[index],
    }));
  }, [debts, year]);

  const maxValue = Math.max(
    5000,
    ...chartData.map((item) => Math.max(item.incoming, item.outgoing))
  );

  const width = 760;
  const height = 320;
  const left = 48;
  const right = 12;
  const top = 20;
  const bottom = 40;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const getX = (index) => left + (index / 11) * plotWidth;
  const getY = (value) => top + plotHeight - (value / maxValue) * plotHeight;

  const pathFor = (key) =>
    chartData
      .map(
        (item, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(item[key])}`
      )
      .join(" ");

  return (
    <Panel sx={{ p: { xs: 2, md: 3.2 } }} palette={palette}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography sx={{ color: palette.text, fontSize: 17, fontWeight: 750 }}>
          Обзор долгов по месяцам
        </Typography>

        <FormControl size="small" sx={{ minWidth: 110 }}>
          <Select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            sx={{
              borderRadius: "10px",
              fontSize: 13,
              color: palette.text,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: palette.border,
              },
            }}
          >
            {[0, 1, 2, 3, 4].map((offset) => {
              const value = String(new Date().getFullYear() - offset);

              return (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={2.5} sx={{ mb: 2.5, flexWrap: "wrap" }}>
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: palette.green }} />
          <Typography sx={{ color: palette.text, fontSize: 13 }}>
            Одолжено (мне должны)
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: palette.red }} />
          <Typography sx={{ color: palette.text, fontSize: 13 }}>
            Заимствовано (я должен)
          </Typography>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            style={{ minWidth: 480, display: "block" }}
          >
            {[0, 1, 2, 3, 4, 5].map((line) => {
              const value = (maxValue / 5) * (5 - line);
              const y = top + (plotHeight / 5) * line;

              return (
                <g key={line}>
                  <line
                    x1={left}
                    y1={y}
                    x2={width - right}
                    y2={y}
                    stroke={palette.grid}
                    strokeDasharray="3 4"
                  />
                  <text
                    x={left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill={palette.secondary}
                    fontSize="11"
                  >
                    {value >= 1000 ? `${Math.round(value / 1000)}k` : Math.round(value)}
                  </text>
                </g>
              );
            })}

            {chartData.map((item, index) => (
              <text
                key={item.month}
                x={getX(index)}
                y={height - 12}
                textAnchor="middle"
                fill={palette.secondary}
                fontSize="11"
              >
                {item.month}
              </text>
            ))}

            <path
              d={pathFor("incoming")}
              fill="none"
              stroke={palette.green}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />

            <path
              d={pathFor("outgoing")}
              fill="none"
              stroke={palette.red}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />

            {chartData.map((item, index) => (
              <g key={`points-${item.month}`}>
                <circle
                  cx={getX(index)}
                  cy={getY(item.incoming)}
                  r="3.5"
                  fill={palette.green}
                />
                <circle
                  cx={getX(index)}
                  cy={getY(item.outgoing)}
                  r="3.5"
                  fill={palette.red}
                />
              </g>
            ))}
          </svg>
        </Box>
      )}
    </Panel>
  );
}

function RecentPayments({ debts, loading, palette = LIGHT_C }) {
  const recent = useMemo(
    () =>
      [...debts]
        .sort(
          (a, b) =>
            new Date(getDate(b) || 0).getTime() -
            new Date(getDate(a) || 0).getTime()
        )
        .slice(0, 6),
    [debts]
  );

  return (
    <Panel sx={{ overflow: "hidden" }} palette={palette}>
      <Box sx={{ p: 2.7, borderBottom: `1px solid ${palette.border}` }}>
        <Typography sx={{ fontSize: 16, fontWeight: 750, color: palette.text }}>
          Последние платежи
        </Typography>
      </Box>

      <Box sx={{ px: 2.5 }}>
        {loading ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <CircularProgress size={25} />
          </Box>
        ) : recent.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <ReceiptLong sx={{ color: palette.secondary, fontSize: 38, mb: 1 }} />
            <Typography sx={{ color: palette.secondary, fontSize: 13 }}>
              Пока нет записей
            </Typography>
          </Box>
        ) : (
          recent.map((debt, index) => {
            const incoming = getDirection(debt) === "incoming";
            const name = getName(debt);

            return (
              <Stack
                key={debt.id ?? debt._id ?? `${name}-${index}`}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  py: 1.7,
                  borderBottom:
                    index === recent.length - 1
                      ? "none"
                      : `1px solid ${palette.border}`,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    bgcolor: incoming ? palette.greenLight : palette.redLight,
                    color: incoming ? palette.green : palette.red,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {incoming ? <ArrowDownward /> : <ArrowUpward />}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: palette.text,
                      fontWeight: 600,
                      fontSize: 13,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {name}
                  </Typography>

                  <Typography sx={{ color: palette.secondary, fontSize: 11, mt: 0.5 }}>
                    {dateText(getDate(debt))}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography
                    sx={{
                      color: incoming ? palette.green : palette.red,
                      fontSize: 14,
                      fontWeight: 750,
                    }}
                  >
                    {incoming ? "+" : "-"}
                    {money(getAmount(debt))}
                  </Typography>

                  <Box
                    sx={{
                      mt: 0.5,
                      px: 1,
                      py: 0.25,
                      border: `1px solid ${incoming ? "#76CDB3" : "#F49B9B"}`,
                      borderRadius: "15px",
                      color: incoming ? palette.green : palette.red,
                      fontSize: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {incoming ? "Входящие" : "Исходящие"}
                  </Box>
                </Box>
              </Stack>
            );
          })
        )}
      </Box>
    </Panel>
  );
}

function AddDebtDialog({ open, onClose, onSave, contacts, folders, saving, palette = LIGHT_C }) {
  const [contactId, setContactId] = useState("");
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("they_owe_me");
  const [folderId, setFolderId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setContactId("");
    setAmount("");
    setDirection("they_owe_me");
    setFolderId("");
    setDueDate("");
    setDescription("");
    setError("");
  }, [open]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!contactId) {
      setError("Выбери контакт.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Укажи сумму больше нуля.");
      return;
    }

    const result = await onSave({
      contact_id: contactId,
      amount: Number(amount),
      direction,
      folder_id: folderId || null,
      due_date: dueDate || null,
      description,
    });

    if (result?.success) onClose();
    else setError(result?.error || "Не удалось сохранить долг.");
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "10px" },
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={submit} sx={{ bgcolor: palette.white }}>
        <DialogTitle sx={{ fontWeight: 750, color: palette.text }}>
          Добавить долг
          <IconButton onClick={onClose} disabled={saving} sx={{ float: "right", color: palette.secondary }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: palette.white }}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            {contacts.length === 0 && (
              <Alert severity="info">
                Сначала добавь контакт в разделе «Контакты».
              </Alert>
            )}

            <FormControl fullWidth>
              <InputLabel sx={{ color: palette.secondary }}>Человек</InputLabel>
              <Select
                label="Человек"
                value={contactId}
                onChange={(event) => setContactId(event.target.value)}
                required
                sx={{
                  color: palette.text,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: palette.border },
                }}
              >
                {contacts.map((contact) => (
                  <MenuItem
                    key={contact.id ?? contact._id}
                    value={contact.id ?? contact._id}
                  >
                    {getName(contact)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Сумма"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputProps={{ min: 0.01, step: "0.01" }}
              required
              fullWidth
              sx={{
                ...fieldSx,
                "& .MuiInputBase-input": { color: palette.text },
                "& .MuiInputLabel-root": { color: palette.secondary },
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: palette.secondary }}>Направление долга</InputLabel>
              <Select
                label="Направление долга"
                value={direction}
                onChange={(event) => setDirection(event.target.value)}
                sx={{
                  color: palette.text,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: palette.border },
                }}
              >
                <MenuItem value="they_owe_me">Мне должны</MenuItem>
                <MenuItem value="i_owe_them">Я должен</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: palette.secondary }}>Папка</InputLabel>
              <Select
                label="Папка"
                value={folderId}
                onChange={(event) => setFolderId(event.target.value)}
                sx={{
                  color: palette.text,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: palette.border },
                }}
              >
                <MenuItem value="">Без папки</MenuItem>
                {folders.map((folder) => (
                  <MenuItem
                    key={folder.id ?? folder._id}
                    value={folder.id ?? folder._id}
                  >
                    {folder.name ?? "Без названия"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Срок возврата"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                "& .MuiInputBase-input": { color: palette.text },
                "& .MuiInputLabel-root": { color: palette.secondary },
              }}
            />

            <TextField
              label="Описание"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              multiline
              minRows={2}
              fullWidth
              sx={{
                "& .MuiInputBase-input": { color: palette.text },
                "& .MuiInputLabel-root": { color: palette.secondary },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: palette.white }}>
          <Button onClick={onClose} disabled={saving} sx={{ color: palette.secondary }}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving || contacts.length === 0}
            sx={{ bgcolor: palette.primary, textTransform: "none" }}
          >
            {saving ? <CircularProgress size={22} color="inherit" /> : "Сохранить"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function CreateFolderDialog({ open, onClose, onSave, saving, palette = LIGHT_C }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setError("");
    }
  }, [open]);

  const submit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Введи название папки.");
      return;
    }

    const result = await onSave(name);

    if (result?.success) onClose();
    else setError(result?.error || "Не удалось создать папку.");
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={submit} sx={{ bgcolor: palette.white }}>
        <DialogTitle sx={{ fontWeight: 750, color: palette.text }}>Создать папку</DialogTitle>

        <DialogContent sx={{ bgcolor: palette.white }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            label="Название папки"
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
            required
            sx={{
              mt: 1,
              "& .MuiInputBase-input": { color: palette.text },
              "& .MuiInputLabel-root": { color: palette.secondary },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: palette.white }}>
          <Button onClick={onClose} disabled={saving} sx={{ color: palette.secondary }}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: palette.primary }}>
            {saving ? <CircularProgress size={22} color="inherit" /> : "Создать"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default function Navigation() {
  const [isDark, setIsDark] = useState(false);
  const palette = getPalette(isDark);

  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [debts, setDebts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [folders, setFolders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingDebt, setSavingDebt] = useState(false);
  const [savingFolder, setSavingFolder] = useState(false);
  const [debtOpen, setDebtOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [notice, setNotice] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotice = useCallback((message, severity = "success") => {
    setNotice({ open: true, message, severity });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);

    const results = await Promise.allSettled([
      axiosRequest.get("/dashboard/summary"),
      axiosRequest.get("/users/me"),
      axiosRequest.get("/folders"),
      axiosRequest.get("/contacts"),
      axiosRequest.get("/debts"),
      axiosRequest.get("/users"),
    ]);

    const [summaryResult, userResult, folderResult, contactResult, debtResult, usersResult] = results;

    if (summaryResult.status === "fulfilled") {
      setSummary(summaryResult.value.data?.data ?? summaryResult.value.data);
    }

    if (userResult.status === "fulfilled") {
      setUser(userResult.value.data?.data ?? userResult.value.data);
    }

    if (folderResult.status === "fulfilled") {
      setFolders(getArray(folderResult.value.data));
    } else {
      console.error("Ошибка загрузки папок:", folderResult.reason);
    }

    if (contactResult.status === "fulfilled") {
      setContacts(getArray(contactResult.value.data));
    } else {
      console.error("Ошибка загрузки контактов:", contactResult.reason);
    }

    if (debtResult.status === "fulfilled") {
      setDebts(getArray(debtResult.value.data));
    } else {
      console.error("Ошибка загрузки долгов:", debtResult.reason);
    }

    if (usersResult.status === "fulfilled") {
      setUsers(getArray(usersResult.value.data));
    } else {
      console.error("Ошибка загрузки пользователей:", usersResult.reason);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totals = useMemo(() => {
    let incoming = 0;
    let outgoing = 0;

    debts.forEach((debt) => {
      const amount = getAmount(debt);
      const direction = getDirection(debt);

      if (direction === "incoming") incoming += amount;
      if (direction === "outgoing") outgoing += amount;
    });

    return { incoming, outgoing };
  }, [debts]);

  const summaryValue = (...keys) => {
    for (const key of keys) {
      if (summary?.[key] !== undefined && summary?.[key] !== null) {
        return Number(summary[key]) || 0;
      }
    }

    return null;
  };

  const incoming =
    summaryValue(
      "total_owed_to_me",
      "owed_to_me",
      "incoming",
      "receivable",
      "total_receivable"
    ) ?? totals.incoming;

  const outgoing =
    summaryValue(
      "total_i_owe",
      "i_owe",
      "outgoing",
      "payable",
      "total_payable"
    ) ?? totals.outgoing;

  const balance =
    summaryValue("balance", "net_balance", "difference") ?? incoming - outgoing;

  const displayName =
    user?.name ??
    user?.full_name ??
    user?.fullName ??
    user?.username ??
    user?.email ??
    "Пользователь";

  const createDebt = async (payload) => {
    setSavingDebt(true);

    try {
      await axiosRequest.post("/debts", payload);
      await loadData();
      showNotice("Долг успешно добавлен.");

      return { success: true };
    } catch (error) {
      console.error("Ошибка создания долга:", error.response?.data ?? error);

      const message =
        error.response?.data?.detail ??
        error.response?.data?.message ??
        error.response?.data?.error ??
        "Не удалось сохранить долг. Проверь поля запроса в Swagger.";

      showNotice(String(message), "error");

      return { success: false, error: String(message) };
    } finally {
      setSavingDebt(false);
    }
  };

  const createFolder = async (name) => {
    setSavingFolder(true);

    try {
      await axiosRequest.post("/folders", { name });
      await loadData();
      showNotice("Папка успешно создана.");

      return { success: true };
    } catch (error) {
      console.error("Ошибка создания папки:", error.response?.data ?? error);

      const message =
        error.response?.data?.detail ??
        error.response?.data?.message ??
        "Не удалось создать папку.";

      showNotice(String(message), "error");

      return { success: false, error: String(message) };
    } finally {
      setSavingFolder(false);
    }
  };

  const navItems = [
    { label: "Панель управления", icon: <Dashboard />, action: () => setUsersOpen(false) },
    { label: "Долги", icon: <Wallet />, action: () => setDebtOpen(true) },
    { label: "Архив", icon: <Archive />, action: () => showNotice("Раздел архива пока не подключён.", "info") },
    { label: "Контакты", icon: <Groups />, action: () => showNotice(`Загружено контактов: ${contacts.length}`, "info") },
    { label: "Папки", icon: <Folder />, action: () => setFolderOpen(true) },
    { label: "Пользователи", icon: <Groups />, action: () => setUsersOpen(true) },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: palette.background }}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? { xs: 72, md: 312 } : 76,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? { xs: 72, md: 312 } : 76,
            boxSizing: "border-box",
            bgcolor: palette.white,
            borderRight: `1px solid ${palette.border}`,
            transition: "width .2s",
            overflowX: "hidden",
          },
        }}
      >
        <Box sx={{ px: 1.5, pt: 2.2, pb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: isDark ? "#1f2937" : "#F8FAFC",
              color: palette.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AccountBalanceWallet />
          </Box>

          {sidebarOpen && (
            <Typography sx={{ display: { xs: "none", md: "block" }, color: palette.text, fontSize: 13, fontWeight: 750 }}>
              ADL 5:8
            </Typography>
          )}
        </Box>

        <Box sx={{ px: 1.5, mb: 1.5 }}>
          {sidebarOpen && (
            <Typography sx={{ display: { xs: "none", md: "block" }, color: palette.text, fontSize: 13, fontWeight: 600, px: 1.5, py: 1 }}>
              ADL 5:8
            </Typography>
          )}
        </Box>

        <Stack spacing={0.8} sx={{ px: 1.4 }}>
          {navItems.map((item, index) => {
            const active = index === 0 && !usersOpen;

            return (
              <Button
                key={item.label}
                onClick={item.action}
                startIcon={item.icon}
                sx={{
                  minHeight: 52,
                  justifyContent: { xs: "center", md: sidebarOpen ? "flex-start" : "center" },
                  px: 1.7,
                  borderRadius: "11px",
                  color: active ? palette.primary : palette.secondary,
                  bgcolor: active ? palette.primaryLight : "transparent",
                  fontWeight: active ? 700 : 500,
                  textTransform: "none",
                  fontSize: 15,
                  "& .MuiButton-startIcon": {
                    mr: { xs: 0, md: sidebarOpen ? 1.5 : 0 },
                    ml: 0,
                  },
                  "&:hover": { bgcolor: palette.primaryLight },
                }}
              >
                <Box sx={{ display: { xs: "none", md: sidebarOpen ? "inline" : "none" } }}>
                  {item.label}
                </Box>
              </Button>
            );
          })}
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Divider sx={{ borderColor: palette.border }} />

        <Stack direction="row" alignItems="center" spacing={1.3} sx={{ p: 2 }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: isDark ? "#1f4d6d" : "#B7E5F9", color: palette.primary, fontWeight: 700 }}>
            {initials(displayName)}
          </Avatar>

          {sidebarOpen && (
            <Box sx={{ minWidth: 0, display: { xs: "none", md: "block" }, flex: 1 }}>
              <Typography sx={{ color: palette.text, fontSize: 14, fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {displayName}
              </Typography>
              <Typography sx={{ color: palette.secondary, fontSize: 12 }}>
                Owner
              </Typography>
            </Box>
          )}
        </Stack>
      </Drawer>

      <Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, md: 4 }, pb: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: 78, mb: 1.5 }}
        >
          <IconButton
            onClick={() => setSidebarOpen((previous) => !previous)}
            sx={{
              width: 48,
              height: 48,
              bgcolor: isDark ? "#1f2937" : "#F0F3F7",
              color: palette.secondary,
              borderRadius: "12px",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 2.5 }}>
            <IconButton
              sx={{ color: palette.secondary }}
              aria-label="Сменить тему"
              onClick={() => setIsDark((value) => !value)}
            >
              {isDark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton sx={{ color: "#94A3B8" }} aria-label="Язык">
              <Language />
            </IconButton>
            <IconButton sx={{ color: "#79CBB5" }} aria-label="Статус">
              <CheckCircle />
            </IconButton>
            <IconButton sx={{ color: palette.secondary }} aria-label="Уведомления">
              <Notifications />
            </IconButton>
            <IconButton sx={{ color: palette.secondary }} aria-label="Развернуть">
              <OpenInFull />
            </IconButton>
            <Avatar sx={{ width: 42, height: 42, bgcolor: isDark ? "#3d7af8" : "#72B8FA" }}>
              {initials(displayName)}
            </Avatar>
          </Stack>
        </Stack>

        {usersOpen ? (
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography sx={{ color: palette.text, fontSize: 25, fontWeight: 750 }}>
                Пользователи
              </Typography>
              <Button onClick={() => setUsersOpen(false)} sx={{ textTransform: "none", color: palette.primary }}>
                Вернуться к панели
              </Button>
            </Stack>

            <Panel sx={{ p: 2.5 }} palette={palette}>
              {loading ? (
                <Box sx={{ py: 5, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              ) : users.length === 0 ? (
                <Typography sx={{ color: palette.secondary, py: 3 }}>
                  Пользователи не найдены. Проверь, поддерживает ли API запрос GET /users.
                </Typography>
              ) : (
                <Stack divider={<Divider sx={{ borderColor: palette.border }} />}>
                  {users.map((item, index) => {
                    const name = getName(item);

                    return (
                      <Stack
                        key={item.id ?? item._id ?? index}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ py: 1.8 }}
                      >
                        <Avatar sx={{ bgcolor: palette.primaryLight, color: palette.primary }}>
                          {initials(name)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ color: palette.text, fontWeight: 650 }}>
                            {name}
                          </Typography>
                          <Typography sx={{ color: palette.secondary, fontSize: 13 }}>
                            {item.email ?? item.username ?? "Контактные данные не указаны"}
                          </Typography>
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
              )}
            </Panel>
          </Box>
        ) : (
          <>
            <Typography sx={{ color: palette.text, fontSize: { xs: 22, md: 25 }, fontWeight: 750, mb: 4 }}>
              Добро пожаловать, {displayName}!
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.8,
                mb: 5,
              }}
            >
              <StatCard
                title="Чистый итог"
                value={money(balance)}
                color={palette.orange}
                background={palette.orangeLight}
                icon={<AccountBalanceWallet />}
                active
                palette={palette}
              />

              <StatCard
                title="Мне должны"
                value={money(incoming)}
                color={palette.green}
                background={palette.greenLight}
                icon={<ArrowDownward />}
                palette={palette}
              />

              <StatCard
                title="Я должен"
                value={money(outgoing)}
                color={palette.red}
                background={palette.redLight}
                icon={<ArrowUpward />}
                palette={palette}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  xl: "minmax(0, 1.65fr) minmax(330px, .9fr)",
                },
                gap: 2.8,
                alignItems: "start",
              }}
            >
              <MonthlyChart debts={debts} loading={loading} palette={palette} />
              <RecentPayments debts={debts} loading={loading} palette={palette} />
            </Box>
          </>
        )}
      </Box>

      <Fab
        aria-label="Добавить долг"
        onClick={() => setDebtOpen(true)}
        sx={{
          position: "fixed",
          right: { xs: 18, md: 38 },
          bottom: { xs: 18, md: 34 },
          width: 62,
          height: 62,
          bgcolor: palette.primary,
          color: "#FFFFFF",
          boxShadow: "0 8px 22px rgba(71,124,255,.3)",
          "&:hover": { bgcolor: isDark ? "#8fb0ff" : "#3268F5" },
        }}
      >
        <Add sx={{ fontSize: 30 }} />
      </Fab>

      <AddDebtDialog
        open={debtOpen}
        onClose={() => setDebtOpen(false)}
        onSave={createDebt}
        contacts={contacts}
        folders={folders}
        saving={savingDebt}
        palette={palette}
      />

      <CreateFolderDialog
        open={folderOpen}
        onClose={() => setFolderOpen(false)}
        onSave={createFolder}
        saving={savingFolder}
        palette={palette}
      />

      <Snackbar
        open={notice.open}
        autoHideDuration={4500}
        onClose={() => setNotice((previous) => ({ ...previous, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity={notice.severity}
          variant="filled"
          onClose={() => setNotice((previous) => ({ ...previous, open: false }))}
          sx={{ width: "100%" }}
        >
          {notice.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
