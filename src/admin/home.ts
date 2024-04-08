import { toast } from "../utils/toast";
import { AccessTokenData } from "../constants";
import { User } from "../models/User";
import { formatCurrencyNumber, initLogout } from "../utils";
import { ApiResponseAuth } from "../active";
import { Order, OrderProps } from "../models/Order";
import { OrderDetail, OrderDetailProps } from "../models/Detail";
import { Chart, ChartItem, registerables } from "chart.js";

Chart.register(...registerables);
(Chart.defaults.font.family = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.color = "#858796";

// type
type CountCancle = {
  userID: string;
  count: number;
};
// functions
async function checkAccessToken() {
  const accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
  if (accessTokenAdmin === null) return;
  let infoUser: AccessTokenData = JSON.parse(accessTokenAdmin);
  const now = new Date().getTime();
  if (infoUser.expireIns < now) {
    console.log("Token het han, phai lay cai moi");
    try {
      const res = await User.refresh();
      const refreshToken: ApiResponseAuth = await res.json();
      if (refreshToken.success) {
        localStorage.setItem(
          "accessTokenAdmin",
          JSON.stringify(refreshToken.data)
        );
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
}
async function handleCheckUser() {
  let userIdOrdersMap: Record<string, CountCancle> = {};
  try {
    const check = await OrderDetail.loadAll();
    if (Array.isArray(check) && check.length > 0) {
      check.forEach((order) => {
        if ((order.orderID as OrderProps).cancelCount) {
          const { userID } = order;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}
async function initChart() {
  // Data
  const monthlyRevenue = [];
  const res =
    (await OrderDetail.loadWithStatus()) as unknown as OrderDetailProps[];
  for (let i = 1; i <= 12; i++) {
    const ordersInMonth = res.filter((order) => {
      const orderMonth = new Date(order.createdAt).getMonth() + 1;
      return orderMonth === i;
    });
    const totalRevenueInMonth = ordersInMonth.reduce(
      (total, order) => total + order.price * order.quantity,
      0
    );
    monthlyRevenue.push(totalRevenueInMonth);
  }
  // Area Chart Example
  const ctx = document.getElementById("myAreaChart") as ChartItem;
  const myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Earnings",
          tension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: monthlyRevenue,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true, // Start y-axis from zero
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `Revenue: ${formatCurrencyNumber(
                tooltipItem.raw as number
              )}`;
            },
          },
        },
      },
    },
  });
}
Chart.defaults.plugins.legend.display = false;
async function initChartOrder() {
  const orders = await Order.loadAll();
  let countStatus3 = 0;
  let countStatus4 = 0;
  let countStatus5 = 0;

  orders.forEach((item) => {
    switch (item.status) {
      case 3:
        countStatus3++;
        break;
      case 4:
        countStatus4++;
        break;
      case 5:
        countStatus5++;
        break;
      default:
        break;
    }
  });
  const statusCounts = [countStatus3, countStatus4, countStatus5];
  const ctx = document.getElementById("myPieChart") as ChartItem;
  const myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Success", "Canceled", "Rejected"],
      datasets: [
        {
          data: statusCounts,
          backgroundColor: ["#4e73df", "#dc3545", "#36b9cc"],
          hoverBackgroundColor: ["#2e59d9", "#dc3520", "#2c9faf"],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          backgroundColor: "rgb(255,255,255)",
          bodyColor: "#858796",
          borderColor: "#dddfeb",
          borderWidth: 1,
          padding: 15,
          displayColors: false,
          caretPadding: 10,
          callbacks: {
            label: (tooltipItem) => {
              const label = tooltipItem.label || "";
              const value = tooltipItem.raw || 0;
              return `${label}: ${value}`;
            },
          },
        },
      },
      cutout: 80,
    },
  });
}

// main
(async () => {
  let accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
  if (accessTokenAdmin === null) {
    window.location.assign("login.html");
  } else {
    if (window.location.pathname === "/admin/index.html") {
      toast.info("Chào mừng admin đăng nhập");
    }
    await checkAccessToken();
    await handleCheckUser();
    initLogout("logout-btn");
  }
  if (window.location.pathname === "/admin/index.html") {
    await initChart();
    await initChartOrder();
  }
})();
