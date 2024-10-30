export const urlServerSide = "https://hemedy-server.onrender.com/api-docs";

const apiLinks = {
  customer: {
    get: `${urlServerSide}/api/Customer`,
    getProfile: `${urlServerSide}/api/Customer/Profile`,
    create: `${urlServerSide}/api/Customer`,
    update: `${urlServerSide}/api/Customer`,
    delete: `${urlServerSide}/api/Customer`,
    getServerAllocationById: `${urlServerSide}/api/Customer`,
    login: `${urlServerSide}/api/Admin/Login`,
    changePassword: `${urlServerSide}/api/Customer/ChangePassword`,
    changeStaffStatusOnline: `${urlServerSide}/api/Admin/UpdateStaffStatusOnline`,
    changeStaffStatusOffline: `${urlServerSide}/api/Admin/UpdateStaffStatusOffline`,
    getAllUserByAdmin: `${urlServerSide}/api/Admin/User/All`,
    banAccount: `${urlServerSide}/api/Admin/User/BanAccount`,
    unBanAccount: `${urlServerSide}/api/Admin/User/UnBanAccount`,
    createDriver: `${urlServerSide}/api/Admin/Driver/Register`,
    createStaff: `${urlServerSide}/api/Admin/Staff/Register`,
    updatePriority: `${urlServerSide}/api/Admin/UpdateUserPriorityById`,
  },

};

export default apiLinks;
