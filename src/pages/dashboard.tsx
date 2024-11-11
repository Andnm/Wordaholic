"use client";

import GoalsChart from "@components/dashboardChart/GoalsChart";
import RevenueChart from "@components/dashboardChart/RevenueChart";
import TopServices from "@components/dashboardChart/TopServices";
import VisitorsChart from "@components/dashboardChart/VisitorsChart";
import VolumeServiceLevel from "@components/dashboardChart/VolumeServiceLevel";
import WorldMap from "@components/dashboardChart/WorldMap";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import SatisfactionChart from "@components/dashboardChart/SatisfactionChart ";
import { Chart as ChartJS, registerables } from "chart.js";
import TodaySalesSummary from "@components/dashboardChart/TodaySalesSummary";
import statistics from "@services/statistics";
import { toast } from "react-toastify";
import { toastError } from "@utils/global";
import { Spin } from "antd";
import { DataSaleType, RevenueWeekType } from "@models/statistic";

ChartJS.register(...registerables);

const ManagerLayoutNoSSR = dynamic(() => import("@layout/ManagerLayout"), {
  ssr: false,
});

const Dashboard = () => {
  const { data: token } = useSession();

  const [statisticSale, setDataSale] = useState<DataSaleType | null>(null);
  const [selectedSearchDateSale, setSelectedSearchDateSale] =
    useState<string>("today");
  const [revenueCurrentWeek, setRevenueCurrentWeek] = useState<RevenueWeekType>(
    {
      dayOfWeekRevenue: [0, 0, 0, 0, 0, 0, 0],
    }
  );
  const [revenueMonthly, setRevenueMonthly] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDateSale, setIsLoadingDateSale] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (token?.user.access_token) {
        try {
          setIsLoadingDateSale(true);
          const statisticSales = await statistics.getStatisticSale(
            token.user.access_token,
            selectedSearchDateSale
          );

          setDataSale(statisticSales);
        } catch (error) {
          toastError(error);
          console.error("Error fetching data: ", error);
        } finally {
          setIsLoadingDateSale(false);
        }
      }
    };
    fetchData();
  }, [token?.user.access_token, selectedSearchDateSale]);

  useEffect(() => {
    const fetchData = async () => {
      if (token?.user.access_token) {
        try {
          setIsLoading(true);

          const revenueCurrentWeeks = statistics.getRevenueCurrentWeek(
            token.user.access_token
          );

          const revenueMonthlys = statistics.getRevenueMonthly(
            token.user.access_token
          );

          const [revenueCurrentWeekResult, revenueMonthlyResult] =
            await Promise.all([revenueCurrentWeeks, revenueMonthlys]);

          setRevenueCurrentWeek(revenueCurrentWeekResult);
          setRevenueMonthly(revenueMonthlyResult);
        } catch (error) {
          toast.error("Có lỗi xảy ra khi tải dữ liệu cá nhân!");
          toastError(error);
          console.error("Error fetching data: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [token?.user.access_token]);

  return (
    <ManagerLayoutNoSSR
      content={
        <div className="dashboard">
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spin />
            </div>
          ) : (
            <>
              <div className="today_sales_summary dashboard_boxshadow">
                <TodaySalesSummary
                  statisticSale={statisticSale!}
                  setSelectedSearchDateSale={setSelectedSearchDateSale}
                  selectedSearchDateSale={selectedSearchDateSale}
                  isLoadingDateSale={isLoadingDateSale}
                />
              </div>
              <div className="visitors_Chart dashboard_boxshadow">
                <VisitorsChart />
              </div>

              <div className="revenue_chart dashboard_boxshadow">
                <RevenueChart revenueCurrentWeek={revenueCurrentWeek} />
              </div>
              <div className="satisfaction_chart dashboard_boxshadow">
                <SatisfactionChart />
              </div>
              <div className="goals_chart dashboard_boxshadow">
                <GoalsChart revenueMonthly={revenueMonthly} />
              </div>
            </>
          )}

          {/* Row 2: Revenue, Satisfaction, Goals */}
          {/* Row 3: Top Services, World Map, Volume vs Service Level */}
          {/*<div className="row">
              <TopServices />
               <WorldMap />
              <VolumeServiceLevel />
            </div> */}
          {/* </div> */}
        </div>
      }
    />
  );
};

export default Dashboard;
