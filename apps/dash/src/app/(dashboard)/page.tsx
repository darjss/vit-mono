// src/app/dashboard/page.tsx (or wherever DashboardHome is)
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsGrid } from "./_components/metric-grid";
import TopProductsList from "./_components/top-product-list";
import PendingOrdersList from "./_components/pending-order-list";
import OrderSalesChart from "./_components/order-sales-chart";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardHomePageData } from "@/server/actions/sales"; // Import the action

// --- Loading Component (Keep as is) ---
const DashboardLoading = () => (
  <div className="container mx-auto space-y-4 px-2 py-4 sm:space-y-6 sm:px-4 sm:py-6 md:px-6 md:py-8">
    {/* ... Skeleton structure ... */}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16 sm:h-4 sm:w-24" />
              <Skeleton className="h-6 w-6 rounded-full sm:h-8 sm:w-8" />
            </div>
            <div className="mt-2 sm:mt-3">
              <Skeleton className="h-6 w-24 sm:h-8 sm:w-32" />
              <Skeleton className="mt-1 h-2 w-28 sm:mt-2 sm:h-3 sm:w-40" />
            </div>
          </div>
        </Card>
      ))}
    </div>
    <div className="grid gap-4 sm:gap-6">
      <Skeleton className="h-[300px] w-full rounded-lg sm:h-[350px] md:h-[400px]" />
      <Skeleton className="h-[300px] w-full rounded-lg sm:h-[350px] md:h-[400px]" />
    </div>
  </div>
);

// --- New Async Component for Content ---
async function DashboardContent() {
  // Fetch all data using the consolidated function
  const dashboardData = await getDashboardHomePageData();

  // Destructure data - check for potential error state
  if (dashboardData.error) {
    console.error("Failed to load dashboard data:", dashboardData.error);
    return <div>Error loading dashboard data. Please try again later.</div>;
  }

  const {
    salesData,
    mostSoldProducts,
    orderCounts,
    pendingOrders,
    // totalVisits, // Keep mock data or fetch separately if needed
  } = dashboardData;

  // Extract data for each time range
  const salesDaily = salesData.daily;
  const salesWeekly = salesData.weekly;
  const salesMonthly = salesData.monthly;

  const mostSoldProductsDaily = mostSoldProducts.daily;
  const mostSoldProductsWeekly = mostSoldProducts.weekly;
  const mostSoldProductsMonthly = mostSoldProducts.monthly;

  const dailyOrders = orderCounts.daily;
  const weeklyOrders = orderCounts.weekly;
  const monthlyOrders = orderCounts.monthly;

  // Mock data (consider replacing with real data from an API or fetching separately)
  const totalVisits = { daily: 120, weekly: 540, monthly: 1254 };

  return (
    <div className="container mx-auto space-y-4 px-2 py-4 sm:space-y-6 sm:px-4 sm:py-6 md:space-y-8 md:px-6 md:py-8">
      <Tabs
        defaultValue="daily"
        className="space-y-4 sm:space-y-6 md:space-y-8"
      >
        <TabsList className="grid w-full max-w-xs grid-cols-3 sm:max-w-sm md:max-w-md">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        {/* Daily View */}
        <TabsContent
          value="daily"
          className="space-y-4 sm:space-y-6 md:space-y-8"
        >
          <MetricsGrid
            sales={salesDaily}
            orders={dailyOrders.count}
            newCustomers={0}
            visits={totalVisits.daily}
          />
          <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-1">
            <div className="w-full overflow-x-auto pb-4">
              <PendingOrdersList orders={pendingOrders} />
            </div>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-0 pt-4 sm:pb-2 sm:pt-6">
                <CardTitle className="text-base sm:text-lg">
                  Sales Overview
                </CardTitle>
              </CardHeader>
              <OrderSalesChart />
            </Card>
            <TopProductsList
              products={mostSoldProductsDaily.slice(0, 5)}
              period="Today"
            />
          </div>
        </TabsContent>

        <TabsContent
          value="weekly"
          className="space-y-4 sm:space-y-6 md:space-y-8"
        >
          <MetricsGrid
            sales={salesWeekly}
            orders={weeklyOrders.count}
            newCustomers={1}
            visits={totalVisits.weekly}
          />
          <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-1">
            <div className="w-full overflow-x-auto pb-4">
              <PendingOrdersList orders={pendingOrders} />
            </div>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-0 pt-4 sm:pb-2 sm:pt-6">
                <CardTitle className="text-base sm:text-lg">
                  Weekly Sales Overview
                </CardTitle>
              </CardHeader>
              <OrderSalesChart />
            </Card>
            <TopProductsList
              products={mostSoldProductsWeekly.slice(0, 5)}
              period="This Week"
            />
          </div>
        </TabsContent>

        {/* Monthly View */}
        <TabsContent
          value="monthly"
          className="space-y-4 sm:space-y-6 md:space-y-8"
        >
          <MetricsGrid
            sales={salesMonthly}
            orders={monthlyOrders.count}
            newCustomers={5}
            visits={totalVisits.monthly}
          />
          <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-1">
            <div className="w-full overflow-x-auto pb-4">
              <PendingOrdersList orders={pendingOrders} />
            </div>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-0 pt-4 sm:pb-2 sm:pt-6">
                <CardTitle className="text-base sm:text-lg">
                  Monthly Sales Overview
                </CardTitle>
              </CardHeader>
              <OrderSalesChart />
            </Card>
            <TopProductsList
              products={mostSoldProductsMonthly.slice(0, 5)}
              period="This Month"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const DashboardHome = () => {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent /> 
    </Suspense>
  );
};

export default DashboardHome;
