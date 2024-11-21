"use client";

import SearchFilterHeader from "@components/manager/SearchFilterHeader";
import { CustomerType } from "@models/customer";
import transaction from "@services/transaction";
import { formatNumberWithCommas } from "@utils/helpers";
import { Spin, Table, Button } from "antd";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManagerLayoutNoSSR = dynamic(() => import("@layout/ManagerLayout"), {
  ssr: false,
});

export interface TransactionType {
  _id: string;
  user_id: string | CustomerType;
  payment_type: string;
  amount: number;
  status: string;
  transaction_type: string;
  product_type: string;
  createdAt: string;
  updatedAt: string;
  transaction_code?: string;
}

const columns = [
  {
    title: "Mã giao dịch",
    dataIndex: "transaction_code",
    key: "transaction_code",
    width: "25%",
  },
  {
    title: "Người mua",
    dataIndex: ["user_id", "fullname"],
    key: "user_fullname",
  },
  {
    title: "Ngày mua",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => new Date(text).toLocaleString(),
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "payment_type",
    key: "payment_type",
    width: "150px",
    render: (paymentType: string) => {
      return paymentType === "Stripe"
        ? "Visa"
        : paymentType === "AccountBalance"
        ? "Ví cá nhân"
        : paymentType;
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: "200px",
    render: (status: string) => {
      const isSuccess = status === "Success";
      const isFailure = status === "Failure";
      return (
        <div className="flex items-center gap-2">
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: true
                ? "#00FF19"
                : isFailure
                ? "#FF002E"
                : "gray",
            }}
          />
          <span>Thành công</span>
        </div>
      );
    },
  },
  {
    title: "Tổng tiền",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number) => formatNumberWithCommas(amount),
  },
];

const Transaction = () => {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<TransactionType[]>([]);
  const [processingData, setProcessingData] = useState<TransactionType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string | undefined>(
    undefined
  );

  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      if (session?.user.access_token) {
        setIsLoading(true);
        try {
          const responseGetAllTransaction =
            await transaction.getAllTransactionsByAdmin(
              session.user.access_token
            );

          const filteredAndSortedData = (responseGetAllTransaction || []).sort(
            (a: TransactionType, b: TransactionType) =>
              new Date(b.createdAt!).getTime() -
              new Date(a.createdAt!).getTime()
          );

          console.log("filteredAndSortedData: ", filteredAndSortedData);

          setOriginalData(filteredAndSortedData);
          setProcessingData(filteredAndSortedData);
        } catch (error: any) {
          toast.error("Có lỗi khi tải dữ liệu");
          toast.error(error!.response?.data?.message);
          console.error("Có lỗi khi tải dữ liệu:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [session?.user.access_token]);

  useEffect(() => {
    let updatedData = [...originalData];

    if (searchText) {
      updatedData = updatedData.filter((transaction: any) =>
        transaction.user_id.fullname
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    if (paymentFilter) {
      updatedData = updatedData.filter(
        (transaction) => transaction.payment_type === paymentFilter
      );
    }

    if (statusFilter) {
      updatedData = updatedData.filter(
        (transaction) => transaction.status === statusFilter
      );
    }

    setProcessingData(updatedData);
  }, [searchText, paymentFilter, statusFilter, originalData]);

  const handleClearFilters = () => {
    setSearchText("");
    setPaymentFilter(undefined);
    setStatusFilter(undefined);
    setProcessingData(originalData);
  };

  return (
    <ManagerLayoutNoSSR
      content={
        <div>
          <div className="header-order">
            <SearchFilterHeader
              searchPlaceholder="Tìm kiếm người mua"
              searchValue={searchText}
              onSearchChange={setSearchText}
              haveFilter={true}
              handleClearFilters={handleClearFilters}
            />
          </div>
          <div className="mt-8">
            <Spin spinning={isLoading}>
              <Table
                columns={columns}
                dataSource={processingData}
                rowKey={(record) => record._id}
                pagination={{ pageSize: 10 }}
              />
            </Spin>
          </div>
        </div>
      }
    />
  );
};

export default Transaction;
