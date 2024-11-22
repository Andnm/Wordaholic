"use client";

import { CustomerType } from "@models/customer";
import SearchFilterHeader from "@components/manager/SearchFilterHeader";
import customer from "@services/customer";
import { ROLE_CUSTOMER } from "@utils/constants";
import {
  generateFallbackAvatar,
  getAccountStatusVietNamese,
} from "@utils/helpers";
import { Spin, Table, Button, Avatar, Menu, Dropdown, TableProps } from "antd";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";
import { VscFolderActive } from "react-icons/vsc";
import { IoIosMore } from "react-icons/io";
import { toast } from "react-toastify";
import { MdBlock } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { handleActionNotSupport } from "@utils/global";
import dayjs from "dayjs";

const columns: TableProps<any>["columns"] = [
  {
    title: "Người dùng",
    dataIndex: "fullname",
    key: "fullname",
    render: (text: string, record: CustomerType) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={record.avatar || generateFallbackAvatar(record.email)}
          alt={record.email}
          style={{ marginRight: "8px", border: "1px solid #d9d9d9" }}
          size={55}
        />
        <div>
          <div className="text-base">{record.fullname}</div>
          <div className="opacity-70">{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    key: "phone_number",
    render: (phone_number: string | undefined) =>
      phone_number ? (
        phone_number
      ) : (
        <i className="text-xs opacity-70">(Chưa cập nhật)</i>
      ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: "200px",
    render: (status: boolean) => {
      return (
        <div className="flex items-center gap-2">
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: status ? "#00FF19" : "#FF002E",
            }}
          />
          <span>{getAccountStatusVietNamese(!status)}</span>
        </div>
      );
    },
  },
  {
    title: "Ngày tham gia",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => dayjs(text).format("DD/MM/YYYY, hh:mm:ss A"),
  },
];

const ManagerLayoutNoSSR = dynamic(() => import("@layout/ManagerLayout"), {
  ssr: false,
});

const UserPage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<CustomerType[]>([]);
  const [processingData, setProcessingData] = useState<CustomerType[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      if (session?.user.access_token) {
        setIsLoading(true);
        try {
          const responseGetAllCustomer = await customer.getAllAccountByAdmin(
            session.user.access_token
          );

          const filteredAndSortedData = (responseGetAllCustomer || []).sort(
            (a: CustomerType, b: CustomerType) =>
              new Date(b.createdAt!).getTime() -
              new Date(a.createdAt!).getTime()
          );

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

    fetchCustomers();
  }, [session?.user.access_token]);

  useEffect(() => {
    let updatedData = [...originalData];

    if (searchText) {
      updatedData = updatedData.filter((customer: CustomerType) =>
        customer.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      updatedData = updatedData.filter(
        (customer) => customer.status === statusFilter
      );
    }

    setProcessingData(updatedData);
  }, [searchText, statusFilter, originalData]);

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter(undefined);
    setProcessingData(originalData);
  };

  return (
    <ManagerLayoutNoSSR
      content={
        <div>
          <div className="header-order">
            <SearchFilterHeader
              searchPlaceholder="Nhập email muốn tìm"
              searchValue={searchText}
              onSearchChange={setSearchText}
              haveFilter={true}
              filters={[
                {
                  label: "Trạng thái",
                  options: [
                    { label: "Đang bị ban", value: true },
                    { label: "Đang hoạt động", value: false },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
              ]}
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

export default UserPage;
