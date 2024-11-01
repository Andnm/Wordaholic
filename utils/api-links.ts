export const urlServerSide = "https://wordaholic-vosv.onrender.com";

const apiLinks = {
  customer: {
    login: `${urlServerSide}/api/Admin/Login`,
    loginWithCustomerEmail: `${urlServerSide}/auth/signInForCustomer`,
    loginWithGoogle: `${urlServerSide}/api/auth/loginGoogle`,
  },
};

export default apiLinks;
