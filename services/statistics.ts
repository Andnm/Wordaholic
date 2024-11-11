import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getStatisticSale = async (token: string, param: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.statistics.statisticSale}/${param}`,
    token: token,
  });
  return response.data;
};

const getRevenueCurrentWeek = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.statistics.revenueCurrentWeek}`,
    token: token,
  });
  return response.data;
};

const getRevenueMonthly = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.statistics.revenueMonthly}`,
    token: token,
  });
  return response.data;
};

const statistics = {
  getRevenueMonthly,
  getRevenueCurrentWeek,
  getStatisticSale,
};

export default statistics;
